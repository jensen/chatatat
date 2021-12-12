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
import type { IUserResource, IRoomResource } from "~/services/types/resources";

import SupabaseProvider from "~/context/supabase";
import AuthProvider from "~/context/auth";

import { indexed } from "./util/transform";
import create from "~/util/session.server";

import Sidebar from "~/components/Sidebar";

import compiledStyles from "~/styles/compiled.css";
import UsersProvider from "./context/users";

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

  const { data: users } = await db.from<IUserResource>("profiles").select();
  const { data: rooms } = await db.from<IRoomResource>("rooms").select();
  const { data: conversations } = await db.rpc("get_conversations");

  return json({
    users: indexed(users || []),
    rooms,
    conversations,
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
      <UsersProvider users={users}>
        <SupabaseProvider token={token}>
          <AuthProvider>
            <Layout>
              <Outlet />
            </Layout>
          </AuthProvider>
        </SupabaseProvider>
      </UsersProvider>
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

function Layout({ children }: { children: React.ReactNode }) {
  const { rooms, conversations } = useLoaderData();

  return (
    <main className="h-full flex flex-col">
      <div className="h-full flex flex-col sm:flex-row">
        <Sidebar rooms={rooms} conversations={conversations} />
        <main className="flex-1 bg-midnight">{children}</main>
      </div>
    </main>
  );
}
