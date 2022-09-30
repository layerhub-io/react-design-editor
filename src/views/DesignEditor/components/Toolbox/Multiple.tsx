import { Block } from "baseui/block"
import Common from "./Common"

const Multiple = () => {
  return (
    <Block
      $style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        justifyContent: "space-between",
      }}
    >
      <Block>Multiple</Block>
      <Common />
    </Block>
  )
}

export default Multiple
