import React from "react";
import { Button } from "./ui/button";

const PageState = ({
  title,
  description,
  actionLabel,
  onAction,
  fullScreen = true
}) => {
  const containerClassName = fullScreen
    ? "min-h-screen flex items-center justify-center px-4"
    : "py-12 flex items-center justify-center px-4";

  return (
    <div className={containerClassName}>
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        {description ? <p className="text-gray-600 mb-4">{description}</p> : null}
        {actionLabel && onAction ? <Button onClick={onAction}>{actionLabel}</Button> : null}
      </div>
    </div>
  );
};

export default PageState;
