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
import { JewelleryPanelList } from '../../../libs/components/admin/properties/PropertyList';
import { AllJewelleriesInquiry } from '../../../libs/types/jewellery/jewellery.input';
import { Jewellery } from '../../../libs/types/jewellery/jewellery';
import { JewelleryLocation, JewelleryStatus } from '../../../libs/enums/jewellery.enum';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import { JewelleryUpdate } from '../../../libs/types/jewellery/jewellery.update';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_PROPERTIES_BY_ADMIN } from '../../../apollo/admin/query';
import { REMOVE_PROPERTY_BY_ADMIN, UPDATE_PROPERTY_BY_ADMIN } from '../../../apollo/admin/mutation';
import { T } from '../../../libs/types/common';

const AdminProperties: NextPage = ({ initialInquiry, ...props }: any) => {
  const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
  const [propertiesInquiry, setPropertiesInquiry] = useState<AllJewelleriesInquiry>(initialInquiry);
  const [properties, setProperties] = useState<Jewellery[]>([]);
  const [propertiesTotal, setPropertiesTotal] = useState<number>(0);
  const [value, setValue] = useState(
    propertiesInquiry?.search?.jewelleryStatus ? propertiesInquiry?.search?.jewelleryStatus : 'ALL',
  );
  const [searchType, setSearchType] = useState('ALL');

  /** APOLLO REQUESTS **/
  const [updatePropertyByAdmin] = useMutation(UPDATE_PROPERTY_BY_ADMIN);
  const [removePropertyByAdmin] = useMutation(REMOVE_PROPERTY_BY_ADMIN);

  const {
    loading: getAllPropertiesByAdminLoading,
    data: getAllPropertiesByAdminData,
    error: getAllPropertiesByAdminError,
    refetch: getAllPropertiesByAdminRefetch,
  } = useQuery(GET_ALL_PROPERTIES_BY_ADMIN, {
    fetchPolicy: 'network-only',
    variables: { input: propertiesInquiry },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setProperties(data?.getAllPropertiesByAdmin?.list);
      setPropertiesTotal(data?.getAllPropertiesByAdmin?.metaCounter[0]?.total ?? 0);
    },
  });

  /** LIFECYCLES **/
  useEffect(() => {
    getAllPropertiesByAdminRefetch({ input: propertiesInquiry }).then();
  }, [propertiesInquiry]);

  /** HANDLERS **/
  const changePageHandler = async (event: unknown, newPage: number) => {
    propertiesInquiry.page = newPage + 1;
    await getAllPropertiesByAdminRefetch({ input: propertiesInquiry });
    setPropertiesInquiry({ ...propertiesInquiry });
  };

  const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    propertiesInquiry.limit = parseInt(event.target.value, 10);
    propertiesInquiry.page = 1;
    await getAllPropertiesByAdminRefetch({ input: propertiesInquiry });
    setPropertiesInquiry({ ...propertiesInquiry });
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

    setPropertiesInquiry({ ...propertiesInquiry, page: 1, sort: 'createdAt' });

    switch (newValue) {
      case 'AVAILABLE':
        setPropertiesInquiry({ ...propertiesInquiry, search: { jewelleryStatus: JewelleryStatus.AVAILABLE } });
        break;
      case 'RESERVED':
        setPropertiesInquiry({ ...propertiesInquiry, search: { jewelleryStatus: JewelleryStatus.RESERVED } });
        break;
      case 'OUT_OF_STOCK':
        setPropertiesInquiry({ ...propertiesInquiry, search: { jewelleryStatus: JewelleryStatus.OUT_OF_STOCK } });
        break;
      default:
        delete propertiesInquiry?.search?.jewelleryStatus;
        setPropertiesInquiry({ ...propertiesInquiry });
        break;
    }
  };

  const removePropertyHandler = async (id: string) => {
    try {
      if (await sweetConfirmAlert('Are you sure to remove?')) {
        await removePropertyByAdmin({
          variables: {
            input: id,
          },
        });

        await getAllPropertiesByAdminRefetch({ input: propertiesInquiry });
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
        setPropertiesInquiry({
          ...propertiesInquiry,
          page: 1,
          sort: 'createdAt',
          search: {
            ...propertiesInquiry.search,
            jewelleryLocationList: [newValue as JewelleryLocation],
          },
        });
      } else {
        delete propertiesInquiry?.search?.jewelleryLocationList;
        setPropertiesInquiry({ ...propertiesInquiry });
      }
    } catch (err: any) {
      console.log('searchTypeHandler: ', err.message);
    }
  };

  const updateJewelleryHandler = async (updateData: JewelleryUpdate) => {
    try {
      console.log('+updateData: ', updateData);
      await updatePropertyByAdmin({
        variables: {
          input: updateData,
        },
      });
      menuIconCloseHandler();
      getAllPropertiesByAdminRefetch({ input: propertiesInquiry });
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
                  onClick={(e: any) => tabChangeHandler(e, 'SOLD')}
                  value="SOLD"
                  className={value === 'SOLD' ? 'li on' : 'li'}
                >
                  Sold
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
              removePropertyHandler={removePropertyHandler}
            />

            <TablePagination
              rowsPerPageOptions={[10, 20, 40, 60]}
              component="div"
              count={propertiesTotal}
              rowsPerPage={propertiesInquiry?.limit}
              page={propertiesInquiry?.page - 1}
              onPageChange={changePageHandler}
              onRowsPerPageChange={changeRowsPerPageHandler}
            />
          </TabContext>
        </Box>
      </Box>
    </Box>
  );
};

AdminProperties.defaultProps = {
  initialInquiry: {
    page: 1,
    limit: 10,
    sort: 'createdAt',
    direction: 'DESC',
    search: {},
  },
};

export default withAdminLayout(AdminProperties);
