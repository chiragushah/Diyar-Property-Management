"use client"

import React, { useState } from "react"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  sortableKeyboardCoordinates,
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Mail, Phone, MoreHorizontal, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateLeadStatus, getLeads, createLead } from "@/lib/actions/leads"

const STAGES = [
  { id: "NEW", title: "New Lead" },
  { id: "CONTACTED", title: "Contacted" },
  { id: "QUALIFIED", title: "Qualified" },
  { id: "VIEWING", title: "Viewing" },
  { id: "LEASE_SENT", title: "Lease Sent" },
  { id: "CLOSED", title: "Closed" },
]

interface Lead {
  id: string
  name: string
  email: string
  phone: string | null
  status: string
  aiScore: number | null
  aiSummary: string | null
}

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  React.useEffect(() => {
    async function loadLeads() {
      const data = await getLeads()
      setLeads(data as Lead[])
      setLoading(false)
    }
    loadLeads()
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const leadId = active.id as string
    const overId = over.id as string

    // Find if we dropped over a column (stage) or another lead
    const overStage = STAGES.find(s => s.id === overId)
    const newStatus = overStage ? overId : leads.find(l => l.id === overId)?.status

    if (newStatus && STAGES.some(s => s.id === newStatus)) {
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l))
      await updateLeadStatus(leadId, newStatus)
    }

    setActiveId(null)
  }

  const handleAddLead = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)

    try {
      const data = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        notes: formData.get("notes") as string,
      }

      const newLead = await createLead(data)
      setLeads(prev => [newLead as unknown as Lead, ...prev])
      setIsDialogOpen(false)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">CRM Pipeline</h1>
          <p className="text-slate-500">Drag and drop leads across different stages</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={<Button />}>
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Lead</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddLead} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" placeholder="John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" placeholder="john@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" placeholder="+1 (555) 000-0000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Initial Notes</Label>
                <Textarea id="notes" name="notes" placeholder="Interested in 2-bedroom units..." />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : "Create Lead"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-200px)]">
          {STAGES.map((stage) => (
            <KanbanColumn
              key={stage.id}
              id={stage.id}
              title={stage.title}
              leads={leads.filter((l) => l.status === stage.id)}
            />
          ))}
        </div>
        <DragOverlay>
          {activeId ? (
            <LeadCard lead={leads.find((l) => l.id === activeId)!} isDragging />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

function KanbanColumn({ id, title, leads }: { id: string, title: string, leads: Lead[] }) {
  const { setNodeRef } = useSortable({ id })

  return (
    <div ref={setNodeRef} className="flex-shrink-0 w-80 bg-slate-100 p-4 rounded-xl flex flex-col gap-4 border border-slate-200">
      <div className="flex items-center justify-between px-2">
        <h3 className="font-semibold text-slate-700 flex items-center gap-2">
          {title}
          <Badge variant="secondary" className="bg-white">{leads.length}</Badge>
        </h3>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>
      <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-3 flex-1 overflow-y-auto min-h-[100px]">
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

function LeadCard({ lead, isDragging }: { lead: Lead, isDragging?: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: lead.id })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing hover:border-blue-400 transition-colors shadow-sm"
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start gap-2">
          <div className="font-medium text-slate-900">{lead.name}</div>
          {lead.aiScore && (
            <Badge className={`${lead.aiScore >= 80 ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"} text-[10px]`}>
              Score: {lead.aiScore}
            </Badge>
          )}
        </div>
        {lead.aiSummary && (
          <p className="text-[10px] text-blue-600 bg-blue-50 p-1.5 rounded italic">
            "{lead.aiSummary}"
          </p>
        )}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Mail className="w-3 h-3" />
            {lead.email}
          </div>
          {lead.phone && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Phone className="w-3 h-3" />
              {lead.phone}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
