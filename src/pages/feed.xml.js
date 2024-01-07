import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
const parser = new MarkdownIt();

export async function GET(context) {
  const blog = await getCollection("blog");

  return rss({
    // `<title>` field in output xml
    title: "Learning Asyncronously",
    // `<description>` field in output xml
    description: "Documenting my journey in product and code!",
    // Pull in your project "site" from the endpoint context
    // https://docs.astro.build/en/reference/api-reference/#contextsite
    site: context.site,
    // Array of `<item>`s in output xml
    // See "Generating items" section for examples using content collections and glob imports
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      tags: post.data.tags,
      content: sanitizeHtml(parser.render(post.body)),
      //   customData: post.data.customData,
      // Compute RSS link from post `slug`
      // This example assumes all posts are rendered as `/blog/[slug]` routes
      link: `/blog/${post.slug}/`,
    })),
    // (optional) inject custom xml
    // customData: `<language>en-us</language>`,
  });
}
