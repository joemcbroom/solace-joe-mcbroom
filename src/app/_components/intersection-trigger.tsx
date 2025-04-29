import { useIntersection } from "react-use";
import { useEffect, useRef } from "react";

export default function IntersectionTrigger({
  onIntersect,
}: {
  onIntersect: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const intersection = useIntersection(ref, {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  });

  useEffect(() => {
    if (intersection?.isIntersecting) {
      onIntersect();
    }
  }, [intersection, onIntersect]);

  return <div ref={ref} />;
}
