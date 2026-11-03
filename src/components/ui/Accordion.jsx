import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function AccordionItem({ title, children, isOpen, onToggle }) {
  return (
    <div className="border-b border-hairline-strong last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between py-5 text-left font-semibold text-ink text-base hover:text-ink/80 transition-colors gap-4"
      >
        <span>{title}</span>
        <ChevronDown
          className={`w-5 h-5 text-muted transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-ink' : ''
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-200 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100 pb-5' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden text-sm text-body leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

export default function Accordion({ items, allowMultiple = false, className = '' }) {
  const [openIndices, setOpenIndices] = useState(allowMultiple ? [0] : 0);

  const handleToggle = (index) => {
    if (allowMultiple) {
      setOpenIndices((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    } else {
      setOpenIndices((prev) => (prev === index ? null : index));
    }
  };

  return (
    <div className={`divide-y divide-hairline-strong ${className}`}>
      {items.map((item, index) => {
        const isOpen = allowMultiple
          ? openIndices.includes(index)
          : openIndices === index;

        return (
          <AccordionItem
            key={item.id || index}
            title={item.question || item.title}
            isOpen={isOpen}
            onToggle={() => handleToggle(index)}
          >
            {item.answer || item.content}
          </AccordionItem>
        );
      })}
    </div>
  );
}
