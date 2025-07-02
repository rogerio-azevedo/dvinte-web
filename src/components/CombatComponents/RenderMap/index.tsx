/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, type ReactElement } from "react";
import { useAuth, useMenu } from "../../../contexts";
import { Stage, Layer, Line, Image, Rect } from "react-konva";
import useImage from "use-image";

import { connect, socket } from "../../../services/socket";
import CharToken from "../CharToken";
import { Container } from "./styles";
import api from "../../../services/api";
import {
  type RenderMapProps,
  type Token,
  type MapData,
  type Line as LineType,
  type StagePos,
} from "./interfaces";

export default function RenderMap({
  tokens = [],
  allowDrag,
  setTokens,
}: RenderMapProps) {
  const { user } = useAuth();
  const { state: menuState, actions: menuActions } = useMenu();
  const { fogLevel, eraserSize, fogPersist } = menuState;

  const [stagePos, setStagePos] = useState<StagePos>({ x: 0, y: 0 });
  const [stageScale, setStageScale] = useState<number>(1);
  const [stageX, setStageX] = useState<number>(0);
  const [stageY, setStageY] = useState<number>(0);
  const [lines, setLines] = useState<LineType[]>(fogPersist);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [selectedId, selectShape] = useState<number | null>(null);
  const [mapData, setMapData] = useState<MapData>({} as MapData);
  const [myToken, setMyToken] = useState<number>(0);

  // dispatch migrado para menuActions
  const is_gm = user?.is_gm;
  const grid = 68;
  const gridWidth =
    mapData?.width > mapData?.height ? mapData?.width : mapData?.height;

  const linesA: ReactElement[] = [];
  const linesB: ReactElement[] = [];

  for (let i = 0; i < gridWidth / grid; i++) {
    linesA.push(
      <Line
        key={`${i}v`}
        strokeWidth={0.5}
        stroke={"white"}
        opacity={0.4}
        points={[i * grid, 0, i * grid, gridWidth]}
      />
    );

    linesB.push(
      <Line
        key={`${i}h`}
        strokeWidth={0.5}
        stroke={"white"}
        opacity={0.4}
        points={[0, i * grid, gridWidth, i * grid]}
      />
    );
  }

  async function getMap() {
    const response = await api.get<MapData>("maps/1");
    setMapData(response?.data);
  }

  function handleWheel(e: any) {
    e.evt.preventDefault();

    const scaleBy = 1.08;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    setStageScale(newScale);
    setStageX(
      -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale
    );
    setStageY(
      -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale
    );
  }

  useEffect(() => {
    socket.on("map.message", (data: MapData) => {
      setMapData(data);

      if (data.portrait !== "") {
        setStagePos({ x: 0, y: 0 });
      }
    });
  }, [mapData]);

  useEffect(() => {
    getMap();
    connect();

    async function getcharToken() {
      const response = await api.get(`combats/${user?.id}`);
      setMyToken(response.data.Cod);
    }

    getcharToken();
  }, [user?.id]); // eslint-disable-line

  function handleMouseDown(e: any) {
    if (e.evt.button === 2 && !allowDrag) {
      setIsDrawing(true);

      const pointer = e.target.getStage().getPointerPosition();

      const newLines = lines?.concat({
        id: Date.now(),
        tool: "eraser",
        points: [pointer.x, pointer.y],
      });
      setLines(newLines);
    }
  }

  function handleMouseUp(e: any) {
    const clickedOnEmpty = e.target !== e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }

    if (isDrawing) {
      setIsDrawing(false);
      socket.emit("line.message", lines);
    }
  }

  function handleMouseMove(e: any) {
    if (!isDrawing) {
      return;
    }

    if (!is_gm) {
      return;
    }

    const pointer = e.target.getStage().getPointerPosition();
    const newLines = lines?.slice();
    const lastLine = {
      ...newLines[newLines?.length - 1],
    };
    lastLine.size = eraserSize;
    lastLine.points = lastLine?.points.concat([pointer.x, pointer.y]);
    newLines[newLines.length - 1] = lastLine;
    setLines(newLines);
  }

  useEffect(() => {
    socket.on("line.message", (data: LineType[]) => {
      setLines(data);
    });
  }, [lines]);

  useEffect(() => {
    menuActions.setFogPersist(lines);
  }, [lines, menuActions]);

  const [map] = useImage(mapData?.battle || "");
  const [portrait] = useImage(mapData?.portrait || "");

  useEffect(() => {
    const handleTokens = (data: Token[]) => {
      console.log("🔄 Socket.IO: Received token.message event with data:", {
        isArray: Array.isArray(data),
        dataLength: data?.length,
        firstToken: data?.[0],
      });

      if (Array.isArray(data) && setTokens) {
        setTokens(data);
      }
    };

    socket.on("token.message", handleTokens);

    return () => socket.off("token.message", handleTokens);
  }, [setTokens]);

  return (
    <Container>
      <Stage
        x={stageX}
        y={stageY}
        scaleX={stageScale}
        scaleY={stageScale}
        width={window.innerWidth}
        height={window.innerHeight}
        onWheel={handleWheel}
        draggable={allowDrag}
        onDragEnd={(e) => {
          if (allowDrag) {
            setStageX(e.currentTarget.x());
            setStageY(e.currentTarget.y());
          }
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onContextMenu={(e) => {
          e.evt.preventDefault();
        }}
      >
        <Layer>
          <Image
            image={map}
            opacity={1}
            width={(mapData?.width || 1200) * 0.6}
            height={(mapData?.height || 800) * 0.6}
          />
        </Layer>

        <Layer opacity={mapData?.grid ? 1 : 0}>
          {linesA}
          {linesB}
        </Layer>

        <Layer>
          <Rect
            x={0}
            y={0}
            width={mapData?.width || 1200}
            height={mapData?.height || 800}
            fill={is_gm ? "#ff0000 " : "#333"}
            opacity={
              mapData?.fog && is_gm
                ? fogLevel / 100
                : mapData?.fog && !is_gm
                ? 1
                : 0
            }
          />

          {lines?.map((line) => (
            <Line
              x={stagePos.x}
              y={stagePos.y}
              key={line?.id}
              strokeWidth={line?.size}
              stroke={"black"}
              points={line?.points}
              globalCompositeOperation={
                line?.tool === "eraser" ? "destination-out" : "source-over"
              }
            />
          ))}

          <Image
            image={portrait}
            opacity={1}
            width={mapData?.orientation ? 450 : 800}
            height={mapData?.orientation ? 600 : 450}
          />
        </Layer>

        <Layer>
          {(Array.isArray(tokens) ? tokens : []).map((item) => (
            <CharToken
              key={item.id}
              id={item.id}
              x={item.x}
              y={item.y}
              isSelected={
                myToken === item.character_id && !allowDrag
                  ? item.id === selectedId
                  : is_gm && !allowDrag && item.id === selectedId
              }
              onSelect={() => {
                selectShape(item.id);
              }}
              image={item.image}
              width={item.width}
              height={item.height}
              rotation={item.rotation || 0}
              draggable={
                myToken === item.character_id && !allowDrag
                  ? true
                  : is_gm && !allowDrag
                  ? true
                  : false
              }
              opacity={
                item.enabled ? 1 : item.enabled === false && is_gm ? 0.6 : 0
              }
            />
          ))}
        </Layer>
      </Stage>
    </Container>
  );
}
