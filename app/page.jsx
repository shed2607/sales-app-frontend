"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import event from "events";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    //event.EventEmitter.defaultMaxListeners = 1;
    router.push("/screens/sign-in");
  });
}
