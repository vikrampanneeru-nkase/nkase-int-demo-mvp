import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Filter, SortDesc, Server, User, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge'

interface Case {
  id: number;
  caseNumber: string;
  title: string;
  updatedAt: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  evidenceCount: number;
  assignedTo: string;
  dueDate: string;
  dueDaysLeft: number;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical':
      return 'bg-destructive';
    case 'high':
      return 'bg-primary';
    case 'medium':
      return 'bg-secondary';
    case 'low':
      return 'bg-accent';
    default:
      return 'bg-secondary';
  }
};

const getDueDateColor = (daysLeft: number) => {
  if (daysLeft <= 1) return 'text-destructive';
  if (daysLeft <= 3) return 'text-warning';
  return 'text-success';
};

interface ActiveCasesProps {
  cases: Case[];
}

export default function ActiveCases({ cases }: ActiveCasesProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Open & In-Progress Investigations</CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-sm bg-neutral-100 border-neutral-200 text-neutral-700 hover:bg-neutral-200"
            >
              <Filter className="h-4 w-4 mr-1" /> Filter
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-sm bg-neutral-100 border-neutral-200 text-neutral-700 hover:bg-neutral-200"
            >
              <SortDesc className="h-4 w-4 mr-1" /> Sort
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cases.map((caseItem) => (
            <Link key={caseItem.id} href={`/cases/${caseItem.id}`}>
              <a className="block">
                <div className="border border-neutral-200 rounded-lg p-4 hover:border-primary cursor-pointer transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm text-neutral-500 mb-1">Investigation #{caseItem.caseNumber}</div>
                      <h3 className="font-medium text-neutral-800">{caseItem.title}</h3>
                      <div className="mt-2 text-sm text-neutral-600">Last updated: {caseItem.updatedAt}</div>
                    </div>
                    <Badge className={cn("text-white", getPriorityColor(caseItem.priority))}>
                      {caseItem.priority.charAt(0).toUpperCase() + caseItem.priority.slice(1)} Priority
                    </Badge>
                  </div>
                  <div className="mt-4 flex items-center text-sm flex-wrap gap-y-2">
                    <div className="text-neutral-600 flex items-center mr-4">
                      <Server className="h-4 w-4 mr-1" />
                      <span>{caseItem.evidenceCount} Evidence Items</span>
                    </div>
                    <div className="text-neutral-600 flex items-center mr-4">
                      <User className="h-4 w-4 mr-1" />
                      <span>Assigned: {caseItem.assignedTo}</span>
                    </div>
                    <div className={cn("flex items-center", getDueDateColor(caseItem.dueDaysLeft))}>
                      <Clock className="h-4 w-4 mr-1" />
                      <span>
                        {caseItem.dueDaysLeft <= 0 
                          ? 'Due today' 
                          : caseItem.dueDaysLeft === 1 
                            ? 'Due tomorrow' 
                            : `Due in ${caseItem.dueDaysLeft} days`}
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <Link href="/cases">
            <a className="text-primary hover:text-secondary text-sm">
              View All Investigations <span aria-hidden="true">→</span>
            </a>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
