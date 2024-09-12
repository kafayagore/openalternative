import { Suspense } from "react"
import { AnalyticsCard } from "~/app/(dashboard)/_components/analytics-card"
import { StatsCard } from "~/app/(dashboard)/_components/stats-card"
import { Card, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { H3 } from "~/components/ui/heading"
import { Skeleton } from "~/components/ui/skeleton"

export default function DashboardPage() {
  return (
    <>
      <H3>Dashboard</H3>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Suspense
          fallback={
            <>
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardDescription>
                      <Skeleton className="w-24">&nbsp;</Skeleton>
                    </CardDescription>
                    <CardTitle className="text-3xl tabular-nums">
                      <Skeleton className="w-12">&nbsp;</Skeleton>
                    </CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </>
          }
        >
          <StatsCard />
        </Suspense>

        <Suspense>
          <AnalyticsCard className="col-span-full" />
        </Suspense>
      </div>
    </>
  )
}