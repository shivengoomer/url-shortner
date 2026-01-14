import React, { useState } from "react";
import styled from "styled-components";
import { Copy } from "lucide-react";

const CopyButton = ({ label = "Copy", done = "Copied!", onClick }) => {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    if (onClick) await onClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Wrapper>
      <button onClick={handleClick} className="flex flex-row gap-2 ">
        <Copy />
        {copied ? done : label}
      </button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: inline-flex;

  button {
    padding: 0.45rem 1rem;
    border-radius: 10px;
    font-size: 0.85rem;
    font-weight: 600;
    white-space: nowrap;

    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.16);
    color: #e8ecff;
    backdrop-filter: blur(10px);

    cursor: pointer;
    transition: background 0.22s ease, border-color 0.22s ease,
      transform 0.15s ease, color 0.22s ease;
  }

  button:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.28);
  }

  button:active {
    transform: scale(0.95);
  }
`;

export default CopyButton;
