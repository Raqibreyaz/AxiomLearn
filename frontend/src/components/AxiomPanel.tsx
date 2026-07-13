/* Spec §3 — Axiom Panel (signature hero visual)
   Bordered card with three connected nodes: Discover → Practice → Prove.
   Must work for any subject domain — no code-specific vocabulary. */

const nodes = [
  {
    num: "01",
    title: "Discover the concept",
    desc: "A short, clear explanation of the idea — no jargon first.",
    done: true,
  },
  {
    num: "02",
    title: "Practice with feedback",
    desc: "Apply it in a guided exercise built for that subject.",
    done: true,
  },
  {
    num: "03",
    title: "Prove you can use it",
    desc: "A real project or assessment — evidence, not just a watch-count.",
    done: false,
  },
];

const AxiomPanel = () => (
  <div className="bg-paper border border-line rounded-lg shadow-raised p-7">
    <div className="font-mono text-[11px] text-t3 uppercase tracking-[0.04em] mb-5">
      How a course is structured
    </div>

    {nodes.map((node, i) => (
      <div key={i} className="ap-node flex gap-4">
        {/* Number badge */}
        <div
          className={`
            w-8 h-8 rounded-pill flex items-center justify-center shrink-0 z-10
            font-mono text-[12.5px] font-semibold
            ${node.done
              ? "bg-axiom text-bone"
              : "bg-axiom-tint text-axiom"}
          `}
        >
          {node.num}
        </div>

        {/* Text */}
        <div>
          <b className="font-body font-semibold text-[15px] text-ink block mb-[3px]">
            {node.title}
          </b>
          <span className="text-[13px] text-t2">{node.desc}</span>
        </div>
      </div>
    ))}
  </div>
);

export default AxiomPanel;
