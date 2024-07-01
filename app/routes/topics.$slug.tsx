import { titleCase } from "@curiousleaf/utils"
import { HeadersFunction, type LoaderFunctionArgs, type MetaFunction, json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { BackButton } from "~/components/BackButton"
import { BreadcrumbsLink } from "~/components/Breadcrumbs"
import { Grid } from "~/components/Grid"
import { Intro } from "~/components/Intro"
import { ToolRecord } from "~/components/records/ToolRecord"
import { type TopicOne, topicOnePayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { JSON_HEADERS } from "~/utils/constants"
import { getMetaTags } from "~/utils/meta"
import { combineServerTimings, makeTimings, time } from "~/utils/timing.server"

export const handle = {
  breadcrumb: (data?: { topic: TopicOne }) => {
    if (!data?.topic) return <BackButton to="/" />

    const { slug } = data.topic

    return <BreadcrumbsLink to={`/topics/${slug}`} label={titleCase(slug)} />
  },
}

export const meta: MetaFunction<typeof loader> = ({ matches, data, location }) => {
  const { title, description } = data?.meta || {}

  return getMetaTags({
    location,
    title,
    description,
    parentMeta: matches.find(({ id }) => id === "root")?.meta,
  })
}

export const headers: HeadersFunction = ({ loaderHeaders, parentHeaders }) => {
  return {
    "Server-Timing": combineServerTimings(parentHeaders, loaderHeaders),
  }
}

export const loader = async ({ params: { slug } }: LoaderFunctionArgs) => {
  const timings = makeTimings("topic loader")

  try {
    const [topic, tools] = await Promise.all([
      time(
        () =>
          prisma.topic.findUniqueOrThrow({
            where: { slug },
            include: topicOnePayload,
          }),
        { type: "find topic", timings },
      ),

      time(
        () =>
          prisma.tool.findMany({
            where: {
              topics: { some: { topic: { slug } } },
              publishedAt: { lte: new Date() },
            },
            include: toolManyPayload,
            orderBy: [{ isFeatured: "desc" }, { score: "desc" }],
          }),
        { type: "find tools", timings },
      ),
    ])

    const name = titleCase(topic.slug)

    const meta = {
      title: `Best Open Source Projects tagged "${name}"`,
      description: `A collection of the best open source projects tagged "${name}". Find the best tools for ${name} that are open source and free to use/self-hostable.`,
    }

    return json(
      { meta, topic, tools },
      { headers: { "Server-Timing": timings.toString(), ...JSON_HEADERS } },
    )
  } catch {
    throw json(null, { status: 404, statusText: "Not Found" })
  }
}

export default function TopicsPage() {
  const { meta, topic, tools } = useLoaderData<typeof loader>()

  return (
    <>
      <Intro {...meta} />

      <Grid>
        {tools.map(tool => (
          <ToolRecord key={tool.id} tool={tool} />
        ))}

        {!tools?.length && <p className="col-span-full">No Open Source software found.</p>}
      </Grid>

      <BackButton to="/topics" />
    </>
  )
}
