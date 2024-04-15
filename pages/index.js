import Main  from "./Home";
import axios from "axios";

export default function Home({ data, banner, offerdata, categories }) {
  console.log(data, "datdadadtatdtddtatd")
  return (
    <>
      <Main data={data} banner={banner} offerdata={offerdata} categories={categories} />
    </>
  );
}

export async function getServerSideProps() {
  try {
    const response = await axios.get("http://localhost:3000/api/merchant");
    const data = response.data.data;
    const offer = await axios.get("http://localhost:3000/api/getOffer");
    const bannerRes = await axios.get("http://localhost:3000/api/getBanner");
    const banner = bannerRes.data.data || []
    const offerdata = offer && offer.data && offer.data.data;
    const value = await axios.get(
      "http://localhost:3000/api/getdeals?categories=deals of the day"
    );
    const categories = value.data.data;
    return {
      props: {
        data,
        banner,
        offerdata,
        categories,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        data: [],
        banner: [],
        offerdata: [],
        categories: [],
      },
    };
  }
}
