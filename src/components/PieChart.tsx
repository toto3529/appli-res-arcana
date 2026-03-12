import Svg, { Path, Circle, Text as SvgText } from "react-native-svg"
import { View, Text } from "react-native"

interface Props {
  valueA: number
  valueB: number
  valueDraw: number
  labelA: string
  labelB: string
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  }
}

function slicePath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  if (endAngle - startAngle >= 360) endAngle = 359.99
  const start = polarToCartesian(cx, cy, r, startAngle)
  const end = polarToCartesian(cx, cy, r, endAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`
}

function labelPosition(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const midAngle = startAngle + (endAngle - startAngle) / 2
  return polarToCartesian(cx, cy, r * 0.65, midAngle)
}

export default function PieChart({ valueA, valueB, valueDraw, labelA, labelB }: Props) {
  const total = valueA + valueB + valueDraw
  if (total === 0) return null

  const cx = 80
  const cy = 80
  const r = 70

  const angleA = (valueA / total) * 360
  const angleDraw = (valueDraw / total) * 360
  const angleB = (valueB / total) * 360

  const startA = 0
  const startDraw = startA + angleA
  const startB = startDraw + angleDraw

  const posA = labelPosition(cx, cy, r, startA, startA + angleA)
  const posDraw = labelPosition(cx, cy, r, startDraw, startDraw + angleDraw)
  const posB = labelPosition(cx, cy, r, startB, startB + angleB)

  return (
    <View>
      <Svg width={160} height={160}>
        {valueA > 0 && <Path d={slicePath(cx, cy, r, startA, startA + angleA)} fill="#4CAF50" />}
        {valueDraw > 0 && <Path d={slicePath(cx, cy, r, startDraw, startDraw + angleDraw)} fill="#C9A84C" />}
        {valueB > 0 && <Path d={slicePath(cx, cy, r, startB, startB + angleB)} fill="#e74c3c" />}
        <Circle cx={cx} cy={cy} r={30} fill="#1e1e1e" />

        {valueA > 5 && (
          <SvgText x={posA.x} y={posA.y} fill="#000" fontSize="11" fontWeight="bold" textAnchor="middle" alignmentBaseline="middle">
            {valueA}%
          </SvgText>
        )}
        {valueDraw > 5 && (
          <SvgText x={posDraw.x} y={posDraw.y} fill="#000" fontSize="11" fontWeight="bold" textAnchor="middle" alignmentBaseline="middle">
            {valueDraw}%
          </SvgText>
        )}
        {valueB > 5 && (
          <SvgText x={posB.x} y={posB.y} fill="#000" fontSize="11" fontWeight="bold" textAnchor="middle" alignmentBaseline="middle">
            {valueB}%
          </SvgText>
        )}
      </Svg>

      <View style={{ flexDirection: "row", justifyContent: "center", gap: 16, marginTop: 8 }}>
        {valueA > 0 && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "#4CAF50" }} />
            <Text style={{ fontSize: 12, color: "#ccc" }}>
              {labelA} {valueA}%
            </Text>
          </View>
        )}
        {valueDraw > 0 && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "#C9A84C" }} />
            <Text style={{ fontSize: 12, color: "#ccc" }}>Nuls {valueDraw}%</Text>
          </View>
        )}
        {valueB > 0 && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "#e74c3c" }} />
            <Text style={{ fontSize: 12, color: "#ccc" }}>
              {labelB} {valueB}%
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}
