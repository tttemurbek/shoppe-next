import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Pagination,
  Stack,
  Typography,
  Container,
  Grid,
  CircularProgress,
} from '@mui/material';
import JewelleryCard from '../../libs/components/jewellery/JewelleryCard';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Filter from '../../libs/components/jewellery/Filter';
import { useRouter } from 'next/router';
import { PropertiesInquiry } from '../../libs/types/jewellery/jewellery.input';
import { Jewellery } from '../../libs/types/jewellery/jewellery';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import TuneIcon from '@mui/icons-material/Tune';
import { Direction, Message } from '../../libs/enums/common.enum';
import { GET_JEWELLERIES } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { useMutation, useQuery } from '@apollo/client';
import { LIKE_TARGET_JEWELLERY } from '../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

const PropertyList: NextPage = ({ initialInput, ...props }: any) => {
  const device = useDeviceDetect();
  const router = useRouter();
  const [searchFilter, setSearchFilter] = useState<PropertiesInquiry>(
    router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
  );
  const [properties, setProperties] = useState<Jewellery[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [sortingOpen, setSortingOpen] = useState(false);
  const [filterSortName, setFilterSortName] = useState('New');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  /** APOLLO REQUESTS **/
  const [likeTargetProperty] = useMutation(LIKE_TARGET_JEWELLERY);

  const {
    loading: getPropertiesLoading,
    data: getPropertiesData,
    error: getPropertiesError,
    refetch: getPropertiesRefetch,
  } = useQuery(GET_JEWELLERIES, {
    fetchPolicy: 'network-only',
    variables: { input: searchFilter },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setProperties(data?.getJewelleries?.list);
      setTotal(data?.getJewelleries?.metaCounter[0]?.total);
    },
  });

  /** LIFECYCLES **/
  useEffect(() => {
    if (router.query.input) {
      const inputObj = JSON.parse(router?.query?.input as string);
      setSearchFilter(inputObj);
    }

    setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
  }, [router]);

  useEffect(() => {
    getPropertiesRefetch({ input: searchFilter }).then();
  }, [searchFilter, getPropertiesRefetch]);

  /** HANDLERS **/
  const likeJewelleryHandler = async (user: T, id: string) => {
    try {
      if (!id) return;
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

      // Execute likeJewelleryHandler
      await likeTargetProperty({ variables: { input: id } });

      // Execute getPropertiesRefetch
      await getPropertiesRefetch({ input: searchFilter });

      await sweetTopSmallSuccessAlert('success', 800);
    } catch (err: any) {
      sweetMixinErrorAlert(err.message).then();
    }
  };

  const handlePaginationChange = async (event: ChangeEvent<unknown>, value: number) => {
    const updatedFilter = { ...searchFilter, page: value };
    await router.push(
      `/jewellery?input=${JSON.stringify(updatedFilter)}`,
      `/jewellery?input=${JSON.stringify(updatedFilter)}`,
      {
        scroll: true,
      },
    );
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
    setSortingOpen(true);
  };

  const sortingCloseHandler = () => {
    setSortingOpen(false);
    setAnchorEl(null);
  };

  const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
    let updatedFilter = { ...searchFilter };

    switch (e.currentTarget.id) {
      case 'new':
        updatedFilter = { ...updatedFilter, sort: 'createdAt', direction: Direction.DESC };
        setFilterSortName('New');
        break;
      case 'lowest':
        updatedFilter = { ...updatedFilter, sort: 'jewelleryPrice', direction: Direction.ASC };
        setFilterSortName('Lowest Price');
        break;
      case 'highest':
        updatedFilter = { ...updatedFilter, sort: 'jewelleryPrice', direction: Direction.DESC };
        setFilterSortName('Highest Price');
        break;
    }

    router.push(
      `/jewellery?input=${JSON.stringify(updatedFilter)}`,
      `/jewellery?input=${JSON.stringify(updatedFilter)}`,
      { scroll: false },
    );

    setSearchFilter(updatedFilter);
    setSortingOpen(false);
    setAnchorEl(null);
  };

  const toggleMobileFilter = () => {
    setMobileFilterOpen(!mobileFilterOpen);
  };

  if (device === 'mobile') {
    return (
      <div className="jewellery-listing-mobile">
        <Container>
          <Typography variant="h4" className="page-title">
            Luxury Jewellery
          </Typography>

          <Box className="mobile-filter-sort">
            <Button variant="outlined" startIcon={<TuneIcon />} onClick={toggleMobileFilter} className="filter-button">
              Filter
            </Button>

            <Button
              variant="outlined"
              endIcon={<KeyboardArrowDownRoundedIcon />}
              onClick={sortingClickHandler}
              className="sort-button"
            >
              {filterSortName}
            </Button>

            <Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler} className="sort-menu">
              <MenuItem onClick={sortingHandler} id="new">
                New
              </MenuItem>
              <MenuItem onClick={sortingHandler} id="lowest">
                Lowest Price
              </MenuItem>
              <MenuItem onClick={sortingHandler} id="highest">
                Highest Price
              </MenuItem>
            </Menu>
          </Box>

          <Box className={`mobile-filter-drawer ${mobileFilterOpen ? 'open' : ''}`}>
            <Box className="filter-header">
              <Typography variant="h6">Filters</Typography>
              <Button onClick={toggleMobileFilter}>Close</Button>
            </Box>
            <Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={initialInput} />
          </Box>

          {getPropertiesLoading ? (
            <Box className="loading-container">
              <CircularProgress />
              <Typography>Loading jewellery collection...</Typography>
            </Box>
          ) : (
            <>
              {properties?.length === 0 ? (
                <Box className="no-results">
                  <img src="/img/icons/icoAlert.svg" alt="No results" />
                  <Typography>No jewellery items found!</Typography>
                  <Typography variant="body2">Try adjusting your filters</Typography>
                </Box>
              ) : (
                <Box className="jewellery-grid">
                  {properties.map((jewellery: Jewellery) => (
                    <JewelleryCard
                      jewellery={jewellery}
                      likeJewelleryHandler={likeJewelleryHandler}
                      key={jewellery?._id}
                    />
                  ))}
                </Box>
              )}

              {properties.length > 0 && (
                <Box className="pagination-container">
                  <Pagination
                    page={currentPage}
                    count={Math.ceil(total / searchFilter.limit)}
                    onChange={handlePaginationChange}
                    shape="rounded"
                    color="primary"
                    size="medium"
                  />
                  <Typography variant="body2" className="results-count">
                    Total {total} item{total !== 1 ? 's' : ''} found
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Container>
      </div>
    );
  } else {
    return (
      <div id="jewellery-listing">
        <Container maxWidth="xl">
          <Box component="header" className="page-header">
            <Typography variant="h4" className="page-title">
              Luxury Jewellery Collection
            </Typography>
            <Box className="sort-controls">
              <Typography variant="body1" className="sort-label">
                Sort by
              </Typography>
              <Button onClick={sortingClickHandler} endIcon={<KeyboardArrowDownRoundedIcon />} className="sort-button">
                {filterSortName}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={sortingOpen}
                onClose={sortingCloseHandler}
                elevation={2}
                className="sort-menu"
              >
                <MenuItem onClick={sortingHandler} id="new" className="sort-menu-item">
                  New
                </MenuItem>
                <MenuItem onClick={sortingHandler} id="lowest" className="sort-menu-item">
                  Lowest Price
                </MenuItem>
                <MenuItem onClick={sortingHandler} id="highest" className="sort-menu-item">
                  Highest Price
                </MenuItem>
              </Menu>
            </Box>
          </Box>

          <Grid container spacing={3} className="main-content">
            <Grid item xs={12} md={3} className="filter-column">
              <Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={initialInput} />
            </Grid>

            <Grid item xs={12} md={9} className="jewellery-column">
              {getPropertiesLoading ? (
                <Box className="loading-container">
                  <CircularProgress />
                  <Typography>Loading fine jewellery collection...</Typography>
                </Box>
              ) : (
                <>
                  {properties?.length === 0 ? (
                    <Box className="no-results">
                      <img src="/img/icons/icoAlert.svg" alt="No results" className="no-results-icon" />
                      <Typography variant="h6">No jewellery items found</Typography>
                      <Typography variant="body2">Try adjusting your filters to see more products</Typography>
                    </Box>
                  ) : (
                    <Box className="jewellery-grid">
                      {properties.map((jewellery: Jewellery) => (
                        <JewelleryCard
                          jewellery={jewellery}
                          likeJewelleryHandler={likeJewelleryHandler}
                          key={jewellery?._id}
                        />
                      ))}
                    </Box>
                  )}

                  {properties.length > 0 && (
                    <Box className="pagination-container">
                      <Pagination
                        page={currentPage}
                        count={Math.ceil(total / searchFilter.limit)}
                        onChange={handlePaginationChange}
                        size="large"
                        shape="rounded"
                        color="primary"
                        showFirstButton
                        showLastButton
                      />
                      <Typography variant="body1" className="results-count">
                        Showing {properties.length} of {total} item{total !== 1 ? 's' : ''}
                      </Typography>
                    </Box>
                  )}
                </>
              )}
            </Grid>
          </Grid>
        </Container>
      </div>
    );
  }
};

PropertyList.defaultProps = {
  initialInput: {
    page: 1,
    limit: 12,
    sort: 'createdAt',
    direction: 'DESC',
    search: {
      squaresRange: {
        start: 0,
        end: 500,
      },
      pricesRange: {
        start: 0,
        end: 2000000,
      },
    },
  },
};

export default withLayoutBasic(PropertyList);
