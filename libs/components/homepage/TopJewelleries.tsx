import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import TopJewelleryCard from './TopJewelleryCard';
import { JewelleriesInquiry } from '../../types/jewellery/jewellery.input';
import { Jewellery } from '../../types/jewellery/jewellery';
import { GET_JEWELLERIES } from '../../../apollo/user/query';
import { useMutation, useQuery } from '@apollo/client';
import { T } from '../../types/common';
import { LIKE_TARGET_JEWELLERY } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';

interface TopPropertiesProps {
  initialInput: JewelleriesInquiry;
}

const TopProperties = (props: TopPropertiesProps) => {
  const { initialInput } = props;
  const device = useDeviceDetect();
  const [topProperties, setTopProperties] = useState<Jewellery[]>([]);

  /** APOLLO REQUESTS **/
  const [likeTargetProperty] = useMutation(LIKE_TARGET_JEWELLERY);

  const {
    loading: getPropertiesLoading,
    data: getPropertiesData,
    error: getPropertiesError,
    refetch: getPropertiesRefetch,
  } = useQuery(GET_JEWELLERIES, {
    fetchPolicy: 'cache-and-network',
    variables: { input: initialInput },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setTopProperties(data?.getJewelleries?.list);
    },
  });
  /** HANDLERS **/

  const likeJewelleryHandler = async (user: T, id: string) => {
    try {
      if (!id) return;
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

      //execute likeJewelleryHandler
      await likeTargetProperty({ variables: { input: id } });

      // execute getPropertiesRefetch
      await getPropertiesRefetch({ input: initialInput });

      await sweetTopSmallSuccessAlert('success', 800);
    } catch (err: any) {
      console.log('ERROR, likeJewelleryHandler:', err.message);
      sweetMixinErrorAlert(err.message).then();
    }
  };

  if (device === 'mobile') {
    return (
      <Stack className={'top-properties'}>
        <Stack className={'container'}>
          <Stack className={'info-box'}>
            <span>Top jewelleries</span>
          </Stack>
          <Stack className={'card-box'}>
            <Swiper
              className={'top-property-swiper'}
              slidesPerView={'auto'}
              centeredSlides={true}
              spaceBetween={15}
              modules={[Autoplay]}
            >
              {topProperties.map((jewellery: Jewellery) => {
                return (
                  <SwiperSlide className={'top-property-slide'} key={jewellery?._id}>
                    <TopJewelleryCard jewellery={jewellery} likeJewelleryHandler={likeJewelleryHandler} />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </Stack>
        </Stack>
      </Stack>
    );
  } else {
    return (
      <Stack className={'top-properties'}>
        <Stack className={'container'}>
          <Stack className={'info-box'}>
            <Box component={'div'} className={'left'}>
              <span>Top jewelleries</span>
              <p>Explore Our Finest Creations</p>
            </Box>
            <Box component={'div'} className={'right'}>
              <div className={'pagination-box'}>
                <WestIcon className={'swiper-top-prev'} />
                <div className={'swiper-top-pagination'}></div>
                <EastIcon className={'swiper-top-next'} />
              </div>
            </Box>
          </Stack>
          <Stack className={'card-box'}>
            <Swiper
              className={'top-property-swiper'}
              slidesPerView={'auto'}
              spaceBetween={15}
              modules={[Autoplay, Navigation, Pagination]}
              navigation={{
                nextEl: '.swiper-top-next',
                prevEl: '.swiper-top-prev',
              }}
              pagination={{
                el: '.swiper-top-pagination',
              }}
            >
              {topProperties.map((jewellery: Jewellery) => {
                return (
                  <SwiperSlide className={'top-property-slide'} key={jewellery?._id}>
                    <TopJewelleryCard jewellery={jewellery} likeJewelleryHandler={likeJewelleryHandler} />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </Stack>
        </Stack>
      </Stack>
    );
  }
};

TopProperties.defaultProps = {
  initialInput: {
    page: 1,
    limit: 8,
    sort: 'jewelleryRank',
    direction: 'DESC',
    search: {},
  },
};

export default TopProperties;
