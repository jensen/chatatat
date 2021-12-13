## Purpose

This project was completed as part of a group learning exercise. This project uses the query builder, authentication, storage and realtime updates provided by [supabase](https://supabase.io).

## Demo

![demo](https://user-images.githubusercontent.com/14803/145367610-1f3460a2-1a94-40f2-b689-29b4fed7eb98.png)

[https://chatatat.netlify.app/](https://chatatat.netlify.app/)

## Project Features

### User Stories

1. ✅ User is prompted to enter a username when he visits the chat app. The username will be stored in the application
2. ✅ User can see an input field where he can type a new message
3. ✅ By pressing the enter key or by clicking on the send button the text will be displayed in the chat box alongside their username (e.g. Jane Doe: Hello World!)

### Bonus features

1. ✅ The messages will be visible to all the Users that are in the chat app (using WebSockets)
2. ✅ Messages are saved in a database
3. ✅ Users can chat in private
4. ✅ Users can join channels on specific topics
5. ✅ Users can upload images, or paste image urls to embed

## Technical Specifications

### Dependencies

- react@next
- remix
- supabase/js
- tailwindcss
- postgres

### Realtime

Chat applications are the most common examples of realtime apps. Supabase provides a realtime API for that allows us to listen to database updates. This application has a few different reasons to listen for updates.

1. Whenever a new user is registerd, which is an `insert`, we want to make sure the normalized user cache is updated.
2. Whenever a new message is sent to a public channel, which is an `insert`, we want to update the list of messages without reloading the page.
3. Whenever a new message is sent to a private user, which is an `insert`, we want to update the list of messages without reloading the page.

Users currently listen to changes for the channel they are in. When they click to another channel, the messages are retrieved and the listener is started for that channel.

```javascript
useEffect(() => {
  if (supabase) {
    /* create a new subscription */
    const subscription = supabase
      /* changes to the room_messages table */
      .from("room_messages")
      /* filter to receive only INSERT type updates */
      .on("INSERT", async (payload) => {
        /* if the message wasn't sent by the local user */
        if (payload.new.user_id !== user?.id) {
          /* callback to add the message to the list */
          update(payload.new);
        }
      })
      .subscribe();

    return () => {
      /* unsubscribe on clean up */
      supabase.removeSubscription(subscription);
    };
  }
}, [supabase, user, update]);
```

This is slightly simplified, the version in being used in production handles private and public messages.

### Storage

Supabase storage is used for image uploads. An image is stored, and the link is included in a message. The messages are all parsed for image links, when an image link is found it is rendered with an image tag.

### Auth

To get server side auth working, I had to build a custom version of supabase and self host it. The custom version of [gotrue](https://github.com/supabase/gotrue) does not include the `access_token` in the redirect to the server. Until now the only way to store the cookie on the server was through an event listener on the client.

With the `access_token` made available on the redirect, we can create the session and send it in the redirect response.

```javascript
export let loader: LoaderFunction = async ({ request, params, context }) => {
  const url = new URL(request.url);
  const token = url.searchParams.get("access_token");
  const local = url.searchParams.get("redirect_to");

  const { getSession, commitSession } = create();

  const session = await getSession(request.headers.get("Cookie"));

  session.set("token", token);

  const cookie = await commitSession(session);

  return redirect(`/?to=${local}` || "/?to=/", {
    headers: {
      "Set-Cookie": cookie,
    },
  });
};
```

The token can be sent to the client when a request is made. When the application is loaded we create an instance of the supabase client with the token stored in the cookie.

### Redirects

Netlify will attach the query string for all redirects. When we redirect the user after receiving the `access_token` we want to remove the search from the url. Didn't find an easy way around this yet.

## Project Setup

### Local Development

Run three processes in separate tabs or concurrently.

```sh
$ npm run dev:netlify
```

```sh
$ npm run dev
```

```sh
$ npm run watch:css
```

### Deployment

```sh
$ npm run build
$ netlify deploy --prod
```
