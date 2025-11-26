import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "mstm.dev | Build. Break. Create."
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#000",
        fontFamily: "serif",
        padding: "80px",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "10%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(84, 225, 232, 0.25) 0%, rgba(0, 0, 0, 0) 60%)",
          filter: "blur(80px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          right: "10%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(84, 225, 232, 0.15) 0%, rgba(0, 0, 0, 0) 60%)",
          filter: "blur(80px)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "32px",
          flex: 1,
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <h1
            style={{
              fontSize: "96px",
              fontWeight: 400,
              color: "#fff",
              margin: 0,
              letterSpacing: "-0.05em",
              lineHeight: 1,
            }}
          >
            mstm.dev
          </h1>
          <div
            style={{
              width: "80px",
              height: "4px",
              backgroundColor: "#54e1e8",
              borderRadius: "2px",
            }}
          />
        </div>
        <p
          style={{
            fontSize: "32px",
            color: "rgba(255, 255, 255, 0.7)",
            margin: 0,
            fontWeight: 300,
            maxWidth: "500px",
          }}
        >
          Build. Break. Create.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "300px",
          height: "300px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            border: "2px solid rgba(84, 225, 232, 0.3)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "70%",
              height: "70%",
              border: "2px solid rgba(84, 225, 232, 0.5)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "40%",
                height: "40%",
                backgroundColor: "#54e1e8",
                borderRadius: "50%",
                boxShadow: "0 0 60px rgba(84, 225, 232, 0.6)",
              }}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: "40px",
          right: "40px",
          width: "60px",
          height: "60px",
          border: "2px solid rgba(84, 225, 232, 0.3)",
          borderBottom: "none",
          borderLeft: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          left: "40px",
          width: "60px",
          height: "60px",
          border: "2px solid rgba(84, 225, 232, 0.3)",
          borderTop: "none",
          borderRight: "none",
        }}
      />
    </div>,
    {
      ...size,
    },
  )
}
