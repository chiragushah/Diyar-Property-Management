import { getProjects } from "@/lib/actions/projects"
import { Button } from "@/components/ui/button"
import { Plus, CheckCircle2, Circle, Calendar, Building } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects & Milestones</h1>
          <p className="text-slate-500">Track property improvements and milestone-based billing</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {projects.map((project) => {
          const completedCount = project.milestones.filter(m => m.status === "COMPLETED").length
          const progress = (completedCount / project.milestones.length) * 100

          return (
            <Card key={project.id} className="overflow-hidden">
              <CardHeader className="bg-slate-50 border-b">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Building className="w-3 h-3" />
                      {project.property.name}
                    </CardDescription>
                  </div>
                  <Badge className={project.status === "COMPLETED" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}>
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Project Progress</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Milestones & Invoicing</h4>
                  <div className="grid gap-3">
                    {project.milestones.map((milestone) => (
                      <div
                        key={milestone.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-white"
                      >
                        <div className="flex items-center gap-3">
                          {milestone.status === "COMPLETED" ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-300" />
                          )}
                          <div>
                            <div className="font-medium text-sm">{milestone.title}</div>
                            <div className="text-xs text-slate-500">${milestone.amount.toLocaleString()} on completion</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {milestone.invoice ? (
                            <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200">
                              Invoiced: {milestone.invoice.number}
                            </Badge>
                          ) : (
                            milestone.status === "COMPLETED" ? (
                              <span className="text-xs text-slate-400">Invoicing...</span>
                            ) : (
                              <Button variant="outline" size="sm" className="h-8 text-xs">Complete</Button>
                            )
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
        {projects.length === 0 && (
          <Card className="p-12 text-center text-slate-500 border-dashed">
            <p>No active projects. Start a new project to track milestones and billing.</p>
          </Card>
        )}
      </div>
    </div>
  )
}
