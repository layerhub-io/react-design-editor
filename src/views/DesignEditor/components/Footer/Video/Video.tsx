import Timeline from "./Timeline"
import Common from "./Common"
import { Block } from "baseui/block"

const Video = () => {
  return (
    <Block $style={{ background: "#ffffff" }}>
      <Timeline />
      <Common />
    </Block>
  )
}

export default Video