import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="skeleton">
            <CardHeader className="pb-3">
              <div className="h-4 w-3/4 rounded skeleton"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-1/2 rounded skeleton"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="skeleton">
            <CardHeader>
              <div className="h-6 w-1/3 rounded skeleton"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 rounded skeleton"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent activity skeleton */}
      <Card className="skeleton">
        <CardHeader>
          <div className="h-6 w-1/4 rounded skeleton"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full skeleton"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded skeleton"></div>
                  <div className="h-3 w-1/2 rounded skeleton"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function TableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-8 w-1/4 rounded skeleton"></div>
        <div className="h-10 w-32 rounded skeleton"></div>
      </div>
      
      <div className="border rounded-lg">
        <div className="h-12 border-b skeleton"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 border-b skeleton last:border-b-0"></div>
        ))}
      </div>
      
      <div className="flex justify-between items-center">
        <div className="h-6 w-32 rounded skeleton"></div>
        <div className="flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 w-10 rounded skeleton"></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function FormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-1/3 rounded skeleton"></div>
      
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-1/4 rounded skeleton"></div>
            <div className="h-10 rounded skeleton"></div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-end space-x-4">
        <div className="h-10 w-24 rounded skeleton"></div>
        <div className="h-10 w-24 rounded skeleton"></div>
      </div>
    </div>
  )
}