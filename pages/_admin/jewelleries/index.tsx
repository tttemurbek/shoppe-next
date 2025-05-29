import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, List, ListItem, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TabContext } from '@mui/lab';
import TablePagination from '@mui/material/TablePagination';
import { JewelleryPanelList } from '../../../libs/components/admin/jewelleries/JewelleryList';
import { AllJewelleriesInquiry } from '../../../libs/types/jewellery/jewellery.input';
import { Jewellery } from '../../../libs/types/jewellery/jewellery';
import { JewelleryLocation, JewelleryStatus } from '../../../libs/enums/jewellery.enum';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import { JewelleryUpdate } from '../../../libs/types/jewellery/jewellery.update';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_JEWELLERIES_BY_ADMIN } from '../../../apollo/admin/query';
import { REMOVE_JEWELLERY_BY_ADMIN, UPDATE_JEWELLERY_BY_ADMIN } from '../../../apollo/admin/mutation';
import { T } from '../../../libs/types/common';

const AdminJewelleries: NextPage = ({ initialInquiry, ...props }: any) => {
  const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
  const [jewelleriesInquiry, setJewelleriesInquiry] = useState<AllJewelleriesInquiry>(initialInquiry);
  const [jewelleries, setJewelleries] = useState<Jewellery[]>([]);
  const [jewelleriesTotal, setJewelleriesTotal] = useState<number>(0);
  const [value, setValue] = useState(
    jewelleriesInquiry?.search?.jewelleryStatus ? jewelleriesInquiry?.search?.jewelleryStatus : 'ALL',
  );
  const [searchType, setSearchType] = useState('ALL');

  /** APOLLO REQUESTS **/
  const [updateJewelleryByAdmin] = useMutation(UPDATE_JEWELLERY_BY_ADMIN);
  const [removeJewelleryByAdmin] = useMutation(REMOVE_JEWELLERY_BY_ADMIN);

  const {
    loading: getAllJewelleriesByAdminLoading,
    data: getAllJewelleriesByAdminData,
    error: getAllJewelleriesByAdminError,
    refetch: getAllJewelleriesByAdminRefetch,
  } = useQuery(GET_ALL_JEWELLERIES_BY_ADMIN, {
    fetchPolicy: 'network-only',
    variables: { input: jewelleriesInquiry },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setJewelleries(data?.getAllJewelleriesByAdmin?.list);
      setJewelleriesTotal(data?.getAllJewelleriesByAdmin?.metaCounter[0]?.total ?? 0);
    },
  });

  /** LIFECYCLES **/
  useEffect(() => {
    getAllJewelleriesByAdminRefetch({ input: jewelleriesInquiry }).then();
  }, [jewelleriesInquiry]);

  /** HANDLERS **/
  const changePageHandler = async (event: unknown, newPage: number) => {
    jewelleriesInquiry.page = newPage + 1;
    await getAllJewelleriesByAdminRefetch({ input: jewelleriesInquiry });
    setJewelleriesInquiry({ ...jewelleriesInquiry });
  };

  const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    jewelleriesInquiry.limit = parseInt(event.target.value, 10);
    jewelleriesInquiry.page = 1;
    await getAllJewelleriesByAdminRefetch({ input: jewelleriesInquiry });
    setJewelleriesInquiry({ ...jewelleriesInquiry });
  };

  const menuIconClickHandler = (e: any, index: number) => {
    const tempAnchor = anchorEl.slice();
    tempAnchor[index] = e.currentTarget;
    setAnchorEl(tempAnchor);
  };

  const menuIconCloseHandler = () => {
    setAnchorEl([]);
  };

  const tabChangeHandler = async (event: any, newValue: string) => {
    setValue(newValue);

    setJewelleriesInquiry({ ...jewelleriesInquiry, page: 1, sort: 'createdAt' });

    switch (newValue) {
      case 'AVAILABLE':
        setJewelleriesInquiry({ ...jewelleriesInquiry, search: { jewelleryStatus: JewelleryStatus.AVAILABLE } });
        break;
      case 'RESERVED':
        setJewelleriesInquiry({ ...jewelleriesInquiry, search: { jewelleryStatus: JewelleryStatus.RESERVED } });
        break;
      case 'OUT_OF_STOCK':
        setJewelleriesInquiry({ ...jewelleriesInquiry, search: { jewelleryStatus: JewelleryStatus.OUT_OF_STOCK } });
        break;
      default:
        delete jewelleriesInquiry?.search?.jewelleryStatus;
        setJewelleriesInquiry({ ...jewelleriesInquiry });
        break;
    }
  };

  const removeJewelleryHandler = async (id: string) => {
    try {
      if (await sweetConfirmAlert('Are you sure to remove?')) {
        await removeJewelleryByAdmin({
          variables: {
            input: id,
          },
        });

        await getAllJewelleriesByAdminRefetch({ input: jewelleriesInquiry });
      }
      menuIconCloseHandler();
    } catch (err: any) {
      sweetErrorHandling(err).then();
    }
  };

  const searchTypeHandler = async (newValue: string) => {
    try {
      setSearchType(newValue);

      if (newValue !== 'ALL') {
        setJewelleriesInquiry({
          ...jewelleriesInquiry,
          page: 1,
          sort: 'createdAt',
          search: {
            ...jewelleriesInquiry.search,
            jewelleryLocationList: [newValue as JewelleryLocation],
          },
        });
      } else {
        delete jewelleriesInquiry?.search?.jewelleryLocationList;
        setJewelleriesInquiry({ ...jewelleriesInquiry });
      }
    } catch (err: any) {
      console.log('searchTypeHandler: ', err.message);
    }
  };

  const updateJewelleryHandler = async (updateData: JewelleryUpdate) => {
    try {
      console.log('+updateData: ', updateData);
      await updateJewelleryByAdmin({
        variables: {
          input: updateData,
        },
      });
      menuIconCloseHandler();
      getAllJewelleriesByAdminRefetch({ input: jewelleriesInquiry });
    } catch (err: any) {
      menuIconCloseHandler();
      sweetErrorHandling(err).then();
    }
  };

  return (
    <Box component={'div'} className={'content'}>
      <Typography variant={'h2'} className={'tit'} sx={{ mb: '24px' }}>
        Jewellery List
      </Typography>
      <Box component={'div'} className={'table-wrap'}>
        <Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={value}>
            <Box component={'div'}>
              <List className={'tab-menu'}>
                <ListItem
                  onClick={(e: any) => tabChangeHandler(e, 'ALL')}
                  value="ALL"
                  className={value === 'ALL' ? 'li on' : 'li'}
                >
                  All
                </ListItem>
                <ListItem
                  onClick={(e: any) => tabChangeHandler(e, 'ACTIVE')}
                  value="ACTIVE"
                  className={value === 'ACTIVE' ? 'li on' : 'li'}
                >
                  Active
                </ListItem>
                <ListItem
                  onClick={(e: any) => tabChangeHandler(e, 'RESERVED')}
                  value="RESERVED"
                  className={value === 'RESERVED' ? 'li on' : 'li'}
                >
                  Reserved
                </ListItem>
                <ListItem
                  onClick={(e: any) => tabChangeHandler(e, 'DELETE')}
                  value="DELETE"
                  className={value === 'DELETE' ? 'li on' : 'li'}
                >
                  Delete
                </ListItem>
              </List>
              <Divider />
              <Stack className={'search-area'} sx={{ m: '24px' }}>
                <Select sx={{ width: '160px', mr: '20px' }} value={searchType}>
                  <MenuItem value={'ALL'} onClick={() => searchTypeHandler('ALL')}>
                    ALL
                  </MenuItem>
                  {Object.values(JewelleryLocation).map((location: string) => (
                    <MenuItem value={location} onClick={() => searchTypeHandler(location)} key={location}>
                      {location}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
              <Divider />
            </Box>
            <JewelleryPanelList
              jewelleries={jewelleries}
              anchorEl={anchorEl}
              menuIconClickHandler={menuIconClickHandler}
              menuIconCloseHandler={menuIconCloseHandler}
              updateJewelleryHandler={updateJewelleryHandler}
              removeJewelleryHandler={removeJewelleryHandler}
            />

            <TablePagination
              rowsPerPageOptions={[10, 20, 40, 60]}
              component="div"
              count={jewelleriesTotal}
              rowsPerPage={jewelleriesInquiry?.limit}
              page={jewelleriesInquiry?.page - 1}
              onPageChange={changePageHandler}
              onRowsPerPageChange={changeRowsPerPageHandler}
            />
          </TabContext>
        </Box>
      </Box>
    </Box>
  );
};

AdminJewelleries.defaultProps = {
  initialInquiry: {
    page: 1,
    limit: 10,
    sort: 'createdAt',
    direction: 'DESC',
    search: {},
  },
};

export default withAdminLayout(AdminJewelleries);
