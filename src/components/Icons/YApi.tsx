import React from "react"

/**
 * Y-API brand mark: the "Y" with the off-string arrow, same geometry as the
 * site favicon. Uses currentColor so it inherits whatever the surrounding
 * text colour is (antd menu, provider list, message avatar).
 */
export const YApiIcon = React.forwardRef<
  SVGSVGElement,
  React.SVGProps<SVGSVGElement>
>((props, ref) => {
  return (
    <svg
      fill="none"
      ref={ref}
      style={{ flex: "none", lineHeight: 1 }}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <g
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M7 8h5l4 7 4-7h5M16 15v10" />
        <path d="M7 5v6" />
        <path d="m21 5 4 3-4 3" transform="translate(1.3 -0.65)" />
      </g>
    </svg>
  )
})
