import satori from "satori";
import { html } from "satori-html";
import { Resvg } from "@resvg/resvg-js";
import { getCollection } from "astro:content";
import { ghostClient } from "../../lib/ghost";
import type { APIContext } from "astro";
import { readFile } from "node:fs/promises";

const dimensions = {
  width: 1200,
  height: 630,
};

interface Props {
  title: string;
  pubDate: Date;
}

export async function GET(context: APIContext) {
  const { title, pubDate } = context.props as Props;
  const date = pubDate.toLocaleDateString("en-US", {
    dateStyle: "full",
  });

  const markup = html`<div tw="bg-[#181818] flex flex-col w-full h-full">
    <div tw="flex flex-col w-full h-4/5 p-10 justify-center">
      <div tw="text-zinc-400 text-2xl mb-6">${date}</div>
      <div
        tw="flex text-6xl w-full font-bold leading-snug tracking-tight text-transparent bg-red-400"
        style="background-clip: text; -webkit-background-clip: text; background: white;"
      >
        ${title}
      </div>
    </div>
    <div
      tw="w-full h-1/5 border-t border-zinc-700/50 flex p-10 items-center justify-between text-2xl"
    >
      <div tw="flex items-center">
        <img
          src="data:image/png;base64,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"
          alt=""
          tw="w-10 h-10"
        />
        <span tw="ml-3 text-zinc-400">joshuaakanetuk.com</span>
      </div>
      <div tw="flex items-center">
        <img
          src="https://avatars.githubusercontent.com/u/56164818?v=4"
          tw="w-15 h-15 rounded-full"
        />
      </div>
    </div>
  </div>`;

  const svg = await satori(markup, {
    fonts: [
      {
        name: "Satori",
        data: await readFile("./public/fonts/Satoshi-Regular.woff"),
        weight: 400,
      },
      {
        name: "Satori",
        data: await readFile("./public/fonts/Satoshi-Bold.woff"),
        weight: 700,
      },
    ],
    height: dimensions.height,
    width: dimensions.width,
  });

  const image = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: dimensions.width,
    },
  }).render();

  return new Response(image.asPng(), {
    headers: {
      "Content-Type": "image/png",
    },
  });
}

export async function getStaticPaths() {
  const posts = await ghostClient.posts
    .browse({
      limit: "all",
    })
    .catch((err) => {
      console.error(err);
    });


  const paths = posts.map((post) => {
    return {
      params: {
        slug: post.slug,
      },
      props: {
        title: post.title,
        pubDate: new Date(post.published_at),
      },
    };
  });
  return paths;
}
