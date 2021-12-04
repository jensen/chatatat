import { useEffect } from "react";
import type { LoaderFunction } from "remix";
import { useLoaderData, json } from "remix";

type IndexData = {};

export let loader: LoaderFunction = () => {
  return json({});
};

interface IIndexViewProps {}

const View = (props: IIndexViewProps) => {
  return <div>View</div>;
};

export default function Index() {
  let data = useLoaderData<IndexData>();

  return <View />;
}
