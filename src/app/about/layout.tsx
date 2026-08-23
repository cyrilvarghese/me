import LightRoom from "@/components/about/LightRoom";

/** The About page is the site's light room (tokens.css): the attribute
    goes on <html>, not on <main>, so the body and the overscroll go
    light with the page rather than framing it in the dark ground. */
export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* a hard load: set before the page paints, or the dark ground
          shows for a frame first. Client transitions are LightRoom's. */}
      <script
        dangerouslySetInnerHTML={{
          __html: 'document.documentElement.dataset.theme="light"',
        }}
      />
      <LightRoom />
      {children}
    </>
  );
}
