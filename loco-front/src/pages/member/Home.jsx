import Carousel from "@/components/member/Common/Carousel";
import One from "/src/assets/images/slide-1.jpg";
import Two from "/src/assets/images/slide-2.jpg";
import Three from "/src/assets/images/slide-3.jpg";
import Four from "/src/assets/images/slide-4.jpg";
import Five from "/src/assets/images/slide-5.jpg";

export default function Home() {
  return (
    <Carousel>
      <img key={0} src={One} alt="Slide 1" />
      <img key={1} src={Two} alt="Slide 2" />
      <img key={2} src={Three} alt="Slide 3" />
      <img key={3} src={Four} alt="Slide 4" />
      <img key={4} src={Five} alt="Slide 5" />
    </Carousel>
  );
}
