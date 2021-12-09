import { Form } from "remix";

export default function Logout() {
  return (
    <Form method="post" action="/auth/logout">
      <button className="flex items-center">
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="m12 2c5.5228475 0 10 4.4771525 10 10s-4.4771525 10-10 10-10-4.4771525-10-10 4.4771525-10 10-10zm0 2c-4.418278 0-8 3.581722-8 8s3.581722 8 8 8c4.0792885 0 7.445465-3.0531957 7.9381123-6.9990449l-7.7351123.0010449 1.6938933 2.3101948-1.6132599 1.1821135-2.92918776-3.9975356c-.23192878-.3165189-.25523539-.7354423-.06986574-1.0725524l2.9987065-4.11155167 1.6139539 1.18116582-1.8362403 2.50816555 7.8771123-.0019513c-.4820213-3.86569526-3.5198343-7.0000487-7.9381123-7.0000487z"
            fill="white"
          />
        </svg>
        <span className="ml-1 text-xs uppercase text-gray-400 font-bold hover:text-gray-200">
          Logout
        </span>
      </button>
    </Form>
  );
}
