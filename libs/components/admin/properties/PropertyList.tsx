import React from 'react';
import Link from 'next/link';
import {
  TableCell,
  TableHead,
  TableBody,
  TableRow,
  Table,
  TableContainer,
  Button,
  Menu,
  Fade,
  MenuItem,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { Stack } from '@mui/material';
import { Jewellery } from '../../../types/jewellery/jewellery';
import { REACT_APP_API_URL } from '../../../config';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import { JewelleryStatus } from '../../../enums/jewellery.enum';

interface Data {
  id: string;
  title: string;
  price: string;
  agent: string;
  location: string;
  type: string;
  status: string;
}

type Order = 'asc' | 'desc';

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'id',
    numeric: true,
    disablePadding: false,
    label: 'MB ID',
  },
  {
    id: 'title',
    numeric: true,
    disablePadding: false,
    label: 'TITLE',
  },
  {
    id: 'price',
    numeric: false,
    disablePadding: false,
    label: 'PRICE',
  },
  {
    id: 'agent',
    numeric: false,
    disablePadding: false,
    label: 'AGENT',
  },
  {
    id: 'location',
    numeric: false,
    disablePadding: false,
    label: 'LOCATION',
  },
  {
    id: 'type',
    numeric: false,
    disablePadding: false,
    label: 'TYPE',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'STATUS',
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, jewellery: keyof Data) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick } = props;

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'left' : 'center'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface JewelleryPanelListType {
  properties: Jewellery[];
  anchorEl: any;
  menuIconClickHandler: any;
  menuIconCloseHandler: any;
  updateJewelleryHandler: any;
  removeJewelleryHandler: any;
}

export const JewelleryPanelList = (props: JewelleryPanelListType) => {
  const {
    properties,
    anchorEl,
    menuIconClickHandler,
    menuIconCloseHandler,
    updateJewelleryHandler,
    removeJewelleryHandler,
  } = props;

  return (
    <Stack>
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
          {/*@ts-ignore*/}
          <EnhancedTableHead />
          <TableBody>
            {properties.length === 0 && (
              <TableRow>
                <TableCell align="center" colSpan={8}>
                  <span className={'no-data'}>data not found!</span>
                </TableCell>
              </TableRow>
            )}

            {properties.length !== 0 &&
              properties.map((jewellery: Jewellery, index: number) => {
                const jewelleryImage = `${REACT_APP_API_URL}/${jewellery?.jewelleryImages[0]}`;

                return (
                  <TableRow hover key={jewellery?._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align="left">{jewellery._id}</TableCell>
                    <TableCell align="left" className={'name'}>
                      {jewellery.jewelleryStatus === JewelleryStatus.AVAILABLE ? (
                        <Stack direction={'row'}>
                          <Link href={`/jewellery/detail?id=${jewellery?._id}`}>
                            <div>
                              <Avatar alt="Remy Sharp" src={jewelleryImage} sx={{ ml: '2px', mr: '10px' }} />
                            </div>
                          </Link>
                          <Link href={`/jewellery/detail?id=${jewellery?._id}`}>
                            <div>{jewellery.jewelleryTitle}</div>
                          </Link>
                        </Stack>
                      ) : (
                        <Stack direction={'row'}>
                          <div>
                            <Avatar alt="Remy Sharp" src={jewelleryImage} sx={{ ml: '2px', mr: '10px' }} />
                          </div>
                          <div style={{ marginTop: '10px' }}>{jewellery.jewelleryTitle}</div>
                        </Stack>
                      )}
                    </TableCell>
                    <TableCell align="center">{jewellery.jewelleryPrice}</TableCell>
                    <TableCell align="center">{jewellery.memberData?.memberNick}</TableCell>
                    <TableCell align="center">{jewellery.jewelleryLocation}</TableCell>
                    <TableCell align="center">{jewellery.jewelleryType}</TableCell>
                    <TableCell align="center">
                      {jewellery.jewelleryStatus === JewelleryStatus.OUT_OF_STOCK && (
                        <Button
                          variant="outlined"
                          sx={{ p: '3px', border: 'none', ':hover': { border: '1px solid #000000' } }}
                          onClick={() => removeJewelleryHandler(jewellery._id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </Button>
                      )}

                      {jewellery.jewelleryStatus === JewelleryStatus.RESERVED && (
                        <Button className={'badge warning'}>{jewellery.jewelleryStatus}</Button>
                      )}

                      {jewellery.jewelleryStatus === JewelleryStatus.AVAILABLE && (
                        <>
                          <Button onClick={(e: any) => menuIconClickHandler(e, index)} className={'badge success'}>
                            {jewellery.jewelleryStatus}
                          </Button>

                          <Menu
                            className={'menu-modal'}
                            MenuListProps={{
                              'aria-labelledby': 'fade-button',
                            }}
                            anchorEl={anchorEl[index]}
                            open={Boolean(anchorEl[index])}
                            onClose={menuIconCloseHandler}
                            TransitionComponent={Fade}
                            sx={{ p: 1 }}
                          >
                            {Object.values(JewelleryStatus)
                              .filter((ele) => ele !== jewellery.jewelleryStatus)
                              .map((status: string) => (
                                <MenuItem
                                  onClick={() =>
                                    updateJewelleryHandler({ _id: jewellery._id, jewelleryStatus: status })
                                  }
                                  key={status}
                                >
                                  <Typography variant={'subtitle1'} component={'span'}>
                                    {status}
                                  </Typography>
                                </MenuItem>
                              ))}
                          </Menu>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};
