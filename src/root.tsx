import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  json,
  useLoaderData,
} from "remix";
import type { LoaderFunction, MetaFunction, LinksFunction } from "remix";
import { supabase } from "~/util/auth";

import SupabaseProvider from "~/context/supabase";
import AuthProvider from "~/context/auth";

import { indexed } from "./util/transform";
import create from "~/util/session.server";

import compiledStyles from "~/styles/compiled.css";

export let meta: MetaFunction = () => {
  return {
    title: "",
    description: "",
  };
};

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: compiledStyles }];
};

export let loader: LoaderFunction = async ({ request }) => {
  const db = await supabase(request);
  const { getSession } = create();

  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");

  const { data: users, error } = await db.from("profiles").select();

  return json({
    users: indexed(users || []),
    token,
    env: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    },
  });
};

export default function App() {
  let { users, env, token } = useLoaderData();

  return (
    <Document>
      <Environment env={env} />
      <SupabaseProvider token={token} users={users}>
        <AuthProvider>
          <Layout>
            <Outlet />
          </Layout>
        </AuthProvider>
      </SupabaseProvider>
    </Document>
  );
}

function Environment({ env }: { env: IEnvironment }) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.env = ${JSON.stringify(env)}`,
      }}
    />
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <Document title="Error!">
      <Layout>
        <div>
          <h1>There was an error</h1>
          <p>{error.message}</p>
          <hr />
          <p>
            Hey, developer, you should replace this with what you want your
            users to see.
          </p>
        </div>
      </Layout>
    </Document>
  );
}

export function CatchBoundary() {
  let caught = useCatch();

  let message;
  switch (caught.status) {
    case 401:
      message = (
        <p>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </p>
      );
      break;
    case 404:
      message = (
        <p>Oops! Looks like you tried to visit a page that does not exist.</p>
      );
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <Layout>
        <h1>
          {caught.status}: {caught.statusText}
        </h1>
        {message}
      </Layout>
    </Document>
  );
}

function Document({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
import DiscordButton from "~/components/DiscordButton";
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="h-full flex flex-col">
      <header className="pl-6 pr-2 py-2 bg-indigo-800 text-yellow-400 flex justify-between items-center">
        <h2 className="text-2xl">
          <span className="font-bold">Another</span>
          <span className="font-light">Chat</span>
        </h2>
        <DiscordButton />
      </header>
      <div className="flex-1 overflow-hidden">{children}</div>
      {/* <footer className="h-8 bg-yellow-400 rounded-full text-white"></footer> */}
    </main>
  );
}
