import React from 'react';
import { Stack, Box } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import useDeviceDetect from '../../hooks/useDeviceDetect';

// History data structure
interface HistoryData {
  year: string;
  title: string;
  description: string;
  imageSrc: string;
}

// Sample history data
const historyData: HistoryData[] = [
  {
    year: '1995',
    title: 'Our Beginning',
    description:
      'Founded with passion and vision, our jewelry studio opened its doors to craft unique pieces that would stand the test of time.',
    imageSrc: '/img/history/founding.webp',
  },
  {
    year: '2003',
    title: 'Expanding Horizons',
    description:
      'With growing demand and recognition for our craftsmanship, we expanded operations to three major cities across the country.',
    imageSrc: '/img/history/expansion.webp',
  },
  {
    year: '2010',
    title: 'International Recognition',
    description:
      'Our dedication to quality earned us prestigious international awards and our first partnerships with renowned designers worldwide.',
    imageSrc: '/img/history/award.webp',
  },
  {
    year: '2015',
    title: 'Innovation Era',
    description:
      'We pioneered new techniques in jewelry crafting, combining traditional methods with cutting-edge technology for truly unique designs.',
    imageSrc: '/img/history/innovation.webp',
  },
  {
    year: '2018',
    title: 'Sustainability Commitment',
    description:
      'We committed to 100% ethical sourcing and sustainable practices, ensuring our creations are as responsible as they are beautiful.',
    imageSrc: '/img/history/sustainable.webp',
  },
  {
    year: '2023',
    title: 'Digital Transformation',
    description:
      'Embracing the future of retail, we launched our immersive online experience, bringing our artistry directly to jewelry lovers worldwide.',
    imageSrc: '/img/history/digital.webp',
  },
];

const HistoryCard = ({ history }: { history: HistoryData }) => {
  const device = useDeviceDetect();

  if (device === 'mobile') {
    return <div>HISTORY CARD</div>;
  } else {
    return (
      <Stack
        className="history-card"
        style={{
          backgroundImage: `url(${history?.imageSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Box component={'div'} className={'info'}>
          <strong>{history?.year}</strong>
          <span>{history?.title}</span>
        </Box>
        <Box component={'div'} className={'more'}>
          <span>{history?.description}</span>
        </Box>
      </Stack>
    );
  }
};

const History = () => {
  const device = useDeviceDetect();

  if (device === 'mobile') {
    return <div>HISTORY MOBILE VIEW</div>;
  } else {
    return (
      <Stack className={'history'}>
        <Stack className={'container'}>
          <Stack className={'info-box'}>
            <Box component={'div'} className={'left'}>
              <span className={'white'}>Our Journey</span>
              <p className={'white'}>Three Decades of Excellence in Jewelry</p>
            </Box>
          </Stack>
          <Stack className={'wrapper'}>
            {/* <Box component={'div'} className={'switch-btn swiper-history-prev'}> */}
            {/* <ArrowBackIosNewIcon /> */}
            {/* </Box> */}
            <Box component={'div'} className={'card-wrapper'}>
              <Swiper
                className={'history-swiper'}
                slidesPerView={4}
                spaceBetween={25}
                modules={[Autoplay, Navigation, Pagination]}
                navigation={{
                  nextEl: '.swiper-history-next',
                  prevEl: '.swiper-history-prev',
                }}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                pagination={{ clickable: true }}
                loop={true}
              >
                {historyData.map((history: HistoryData) => {
                  return (
                    <SwiperSlide className={'history-slide'} key={history?.year}>
                      <HistoryCard history={history} />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </Box>
            {/* <Box component={'div'} className={'switch-btn swiper-history-next'}> */}
            {/* <ArrowBackIosNewIcon /> */}
            {/* </Box> */}
          </Stack>
        </Stack>
      </Stack>
    );
  }
};

export default History;
