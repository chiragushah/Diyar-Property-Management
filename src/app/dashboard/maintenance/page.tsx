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
import { Plus, Clock, AlertCircle, CheckCircle2, Bot, Loader2 } from "lucide-react"
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
import { getMaintenanceRequests, updateMaintenanceStatus, createMaintenanceRequest } from "@/lib/actions/maintenance"

const COLUMNS = [
  { id: "OPEN", title: "To Do", icon: AlertCircle, color: "text-blue-500" },
  { id: "IN_PROGRESS", title: "In Progress", icon: Clock, color: "text-orange-500" },
  { id: "RESOLVED", title: "Resolved", icon: CheckCircle2, color: "text-green-500" },
  { id: "CLOSED", title: "Closed", icon: CheckCircle2, color: "text-slate-500" },
]

interface Request {
  id: string
  title: string
  description: string
  priority: string
  status: string
  lease?: any
}

export default function MaintenancePage() {
  const [requests, setRequests] = useState<Request[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  React.useEffect(() => {
    async function load() {
      const data = await getMaintenanceRequests()
      setRequests(data as any[])
      setLoading(false)
    }
    load()
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

    const requestId = active.id as string
    const overId = over.id as string

    const overColumn = COLUMNS.find(c => c.id === overId)
    const newStatus = overColumn ? overId : requests.find(r => r.id === overId)?.status

    if (newStatus && COLUMNS.some(c => c.id === newStatus)) {
      setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: newStatus } : r))
      await updateMaintenanceStatus(requestId, newStatus)
    }

    setActiveId(null)
  }

  const handleAddRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)

    try {
      const data = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
      }

      const newRequest = await createMaintenanceRequest(data)
      setRequests(prev => [newRequest as unknown as Request, ...prev])
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
          <h1 className="text-3xl font-bold">Maintenance</h1>
          <p className="text-slate-500">Track and manage repair requests</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={<Button />}>
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Maintenance Request</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddRequest} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Issue Title</Label>
                <Input id="title" name="title" placeholder="Broken AC, Leaking Pipe..." required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Please describe the issue in detail. AI will analyze the priority based on your description."
                  className="h-32"
                  required
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing & Creating...
                    </>
                  ) : "Submit Request"}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {COLUMNS.map((column) => (
            <MaintenanceColumn
              key={column.id}
              column={column}
              requests={requests.filter((r) => r.status === column.id)}
            />
          ))}
        </div>
        <DragOverlay>
          {activeId ? (
            <RequestCard request={requests.find((r) => r.id === activeId)!} isDragging />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

function MaintenanceColumn({ column, requests }: { column: any, requests: Request[] }) {
  const { setNodeRef } = useSortable({ id: column.id })

  return (
    <div ref={setNodeRef} className="bg-slate-100 p-4 rounded-xl flex flex-col gap-4 border border-slate-200 min-h-[500px]">
      <div className="flex items-center gap-2 px-2">
        <column.icon className={`w-5 h-5 ${column.color}`} />
        <h3 className="font-semibold text-slate-700">{column.title}</h3>
        <Badge variant="secondary" className="ml-auto bg-white">{requests.length}</Badge>
      </div>
      <SortableContext items={requests.map(r => r.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-3">
          {requests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

function RequestCard({ request, isDragging }: { request: Request, isDragging?: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: request.id })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const priorityColors: Record<string, string> = {
    LOW: "bg-blue-100 text-blue-700",
    MEDIUM: "bg-orange-100 text-orange-700",
    HIGH: "bg-red-100 text-red-700",
    URGENT: "bg-purple-100 text-purple-700",
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
          <span className="font-medium text-sm text-slate-900 leading-snug">{request.title}</span>
          <Badge className={`text-[10px] px-1.5 py-0 ${priorityColors[request.priority]}`}>
            {request.priority}
          </Badge>
        </div>
        <p className="text-xs text-slate-500 line-clamp-2">{request.description}</p>
        <div className="flex items-center gap-1 text-[10px] text-blue-600 font-medium bg-blue-50 px-1.5 py-0.5 rounded w-fit">
          <Bot className="w-3 h-3" />
          AI Prioritized
        </div>
        {request.lease && (
          <div className="pt-2 border-t text-[10px] text-slate-400">
            {request.lease.unit.property.name} - Unit {request.lease.unit.unitNumber}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
