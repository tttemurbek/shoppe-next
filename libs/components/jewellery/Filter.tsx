// @ts-nocheck

import React, { useCallback, useEffect, useState } from 'react';
import {
  Stack,
  Typography,
  Checkbox,
  IconButton,
  OutlinedInput,
  Tooltip,
  Fade,
  Paper,
  Box,
  Slider,
  Chip,
} from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { JewelleryLocation, JewelleryType } from '../../enums/jewellery.enum';
import { PropertiesInquiry } from '../../types/jewellery/jewellery.input';
import { useRouter } from 'next/router';
import SearchIcon from '@mui/icons-material/Search';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CategoryIcon from '@mui/icons-material/Category';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const Filter = (props: { searchFilter: PropertiesInquiry; setSearchFilter: any; initialInput: PropertiesInquiry }) => {
  const { searchFilter, setSearchFilter, initialInput } = props;
  const device = useDeviceDetect();
  const router = useRouter();

  // State variables
  const [jewelleryLocation] = useState<JewelleryLocation[]>(Object.values(JewelleryLocation));
  const [jewelleryType] = useState<JewelleryType[]>(Object.values(JewelleryType));
  const [searchText, setSearchText] = useState<string>('');
  const [showMore, setShowMore] = useState<boolean>(false);
  const [expandedSections, setExpandedSections] = useState({
    location: false,
    type: false,
    options: false,
    price: true,
  });

  // Price range state for slider
  const [priceRange, setPriceRange] = useState<number[]>([
    searchFilter?.search?.pricesRange?.start || 0,
    searchFilter?.search?.pricesRange?.end || 1000,
  ]);

  // Handle URL updates when filters change
  useEffect(() => {
    const handleEmptyArrays = async (field: string) => {
      if (searchFilter?.search?.[field]?.length === 0) {
        const newSearchFilter = { ...searchFilter };
        delete newSearchFilter.search[field];

        await router.push(
          `/jewellery?input=${JSON.stringify(newSearchFilter)}`,
          `/jewellery?input=${JSON.stringify(newSearchFilter)}`,
          { scroll: false },
        );
      }
    };

    // Check and handle empty arrays
    if (searchFilter?.search) {
      handleEmptyArrays('locationList');
      handleEmptyArrays('typeList');
      handleEmptyArrays('roomsList');
      handleEmptyArrays('options');
      handleEmptyArrays('bedsList');
    }

    // Show more section if location filter is active
    if (searchFilter?.search?.locationList) {
      setShowMore(true);
    }
  }, [searchFilter, router]);

  // Toggle section expanded state
  const toggleSection = (section: string) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  // Handler for location selection
  const handleLocationSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        const isChecked = e.target.checked;
        const value = e.target.value;
        const currentLocations = [...(searchFilter?.search?.locationList || [])];

        let newLocations;
        if (isChecked) {
          newLocations = [...currentLocations, value];
        } else {
          newLocations = currentLocations.filter((item) => item !== value);
        }

        const newFilter = {
          ...searchFilter,
          search: { ...searchFilter.search, locationList: newLocations },
        };

        await router.push(
          `/jewellery?input=${JSON.stringify(newFilter)}`,
          `/jewellery?input=${JSON.stringify(newFilter)}`,
          { scroll: false },
        );
      } catch (err: any) {
        console.log('ERROR, handleLocationSelect:', err);
      }
    },
    [searchFilter, router],
  );

  // Handler for jewellery type selection
  const handleTypeSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        const isChecked = e.target.checked;
        const value = e.target.value;
        const currentTypes = [...(searchFilter?.search?.typeList || [])];

        let newTypes;
        if (isChecked) {
          newTypes = [...currentTypes, value];
        } else {
          newTypes = currentTypes.filter((item) => item !== value);
        }

        const newFilter = {
          ...searchFilter,
          search: { ...searchFilter.search, typeList: newTypes },
        };

        await router.push(
          `/jewellery?input=${JSON.stringify(newFilter)}`,
          `/jewellery?input=${JSON.stringify(newFilter)}`,
          { scroll: false },
        );
      } catch (err: any) {
        console.log('ERROR, handleTypeSelect:', err);
      }
    },
    [searchFilter, router],
  );

  // Handler for options selection
  const handleOptionSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        const isChecked = e.target.checked;
        const value = e.target.value;
        const currentOptions = [...(searchFilter?.search?.options || [])];

        let newOptions;
        if (isChecked) {
          newOptions = [...currentOptions, value];
        } else {
          newOptions = currentOptions.filter((item) => item !== value);
        }

        const newFilter = {
          ...searchFilter,
          search: { ...searchFilter.search, options: newOptions },
        };

        await router.push(
          `/jewellery?input=${JSON.stringify(newFilter)}`,
          `/jewellery?input=${JSON.stringify(newFilter)}`,
          { scroll: false },
        );
      } catch (err: any) {
        console.log('ERROR, handleOptionSelect:', err);
      }
    },
    [searchFilter, router],
  );

  // Handle price range slider change
  const handlePriceChange = useCallback((event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  }, []);

  // Update URL when price slider is released
  const handlePriceCommitted = useCallback(
    async (event: React.SyntheticEvent | Event, newValue: number | number[]) => {
      const [start, end] = newValue as number[];

      const newFilter = {
        ...searchFilter,
        search: {
          ...searchFilter.search,
          pricesRange: { start, end },
        },
      };

      await router.push(
        `/jewellery?input=${JSON.stringify(newFilter)}`,
        `/jewellery?input=${JSON.stringify(newFilter)}`,
        { scroll: false },
      );
    },
    [searchFilter, router],
  );

  // Handle search text submission
  const handleSearchSubmit = useCallback(() => {
    const newFilter = {
      ...searchFilter,
      search: { ...searchFilter.search, text: searchText },
    };

    setSearchFilter(newFilter);
  }, [searchFilter, searchText, setSearchFilter]);

  // Reset all filters
  const handleReset = useCallback(async () => {
    try {
      setSearchText('');
      setPriceRange([0, 1000]);

      await router.push(
        `/jewellery?input=${JSON.stringify(initialInput)}`,
        `/jewellery?input=${JSON.stringify(initialInput)}`,
        { scroll: false },
      );
    } catch (err: any) {
      console.log('ERROR, handleReset:', err);
    }
  }, [initialInput, router]);

  // Mobile view
  if (device === 'mobile') {
    return (
      <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="h6">JEWELLERY FILTER</Typography>
        <Typography variant="body2">Please use desktop view for full filter options</Typography>
      </Paper>
    );
  }

  // Desktop view with redesigned UI
  return (
    <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <Box
        sx={{
          backgroundColor: '#f0f2f5',
          p: 2,
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Find Your Dream Jewellery
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderRadius: 2,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <IconButton sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>

          <OutlinedInput
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearchSubmit();
              }
            }}
            placeholder="What are you looking for?"
            fullWidth
            sx={{
              border: 'none',
              '& fieldset': { border: 'none' },
              fontSize: '0.9rem',
            }}
            endAdornment={
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {searchText && (
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSearchText('');
                      setSearchFilter({
                        ...searchFilter,
                        search: { ...searchFilter.search, text: '' },
                      });
                    }}
                  >
                    <CancelRoundedIcon fontSize="small" />
                  </IconButton>
                )}

                <Tooltip title="Reset All Filters">
                  <IconButton size="small" onClick={handleReset} sx={{ color: '#666' }}>
                    <RefreshIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            }
          />
        </Box>
      </Box>

      <Stack sx={{ p: 3, gap: 2 }}>
        {/* Location Filter Section */}
        <Paper elevation={0} sx={{ p: 2, bgcolor: '#fafafa', borderRadius: 2 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              mb: expandedSections.location ? 2 : 0,
            }}
            onClick={() => toggleSection('location')}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOnIcon color="black" fontSize="small" />
              <Typography variant="subtitle1" fontWeight={600}>
                Location
              </Typography>

              {searchFilter?.search?.locationList?.length > 0 && (
                <Chip
                  size="small"
                  label={searchFilter.search.locationList.length}
                  color="primary"
                  sx={{ height: 20, fontSize: '0.7rem' }}
                />
              )}
            </Box>

            {expandedSections.location ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Box>

          {expandedSections.location && (
            <Fade in={expandedSections.location}>
              <Box
                sx={{
                  maxHeight: showMore ? 'none' : '130px',
                  overflowY: 'hidden',
                  transition: 'max-height 0.3s ease-in-out',
                  position: 'relative',
                }}
                onMouseEnter={() => setShowMore(true)}
                onMouseLeave={() => {
                  if (!searchFilter?.search?.locationList?.length) {
                    setShowMore(false);
                  }
                }}
              >
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                  {jewelleryLocation.map((location) => (
                    <Box
                      key={location}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        py: 0.5,
                      }}
                    >
                      <Checkbox
                        id={`location-${location}`}
                        size="small"
                        value={location}
                        checked={(searchFilter?.search?.locationList || []).includes(location as JewelleryLocation)}
                        onChange={handleLocationSelect}
                        sx={{
                          p: 0.5,
                          color: '#bdbdbd',
                          '&.Mui-checked': {
                            color: '#1976d2',
                          },
                        }}
                      />
                      <Box
                        component="label"
                        htmlFor={`location-${location}`}
                        sx={{
                          ml: 1,
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: (searchFilter?.search?.locationList || []).includes(location as JewelleryLocation)
                            ? 500
                            : 400,
                          color: (searchFilter?.search?.locationList || []).includes(location as JewelleryLocation)
                            ? '#1976d2'
                            : 'inherit',
                        }}
                      >
                        {location}
                      </Box>
                    </Box>
                  ))}
                </Box>

                {!showMore && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '40px',
                      background: 'linear-gradient(transparent, #fafafa)',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                    }}
                  >
                    <IconButton size="small" onClick={() => setShowMore(true)}>
                      <MoreHorizIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Fade>
          )}
        </Paper>

        {/* Jewellery Type Filter Section */}
        <Paper elevation={0} sx={{ p: 2, bgcolor: '#fafafa', borderRadius: 2 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              mb: expandedSections.type ? 2 : 0,
            }}
            onClick={() => toggleSection('type')}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CategoryIcon color="black" fontSize="small" />
              <Typography variant="subtitle1" fontWeight={600}>
                Jewellery Type
              </Typography>

              {searchFilter?.search?.typeList?.length > 0 && (
                <Chip
                  size="small"
                  label={searchFilter.search.typeList.length}
                  color="primary"
                  sx={{ height: 20, fontSize: '0.7rem' }}
                />
              )}
            </Box>

            {expandedSections.type ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Box>

          {expandedSections.type && (
            <Fade in={expandedSections.type}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                {jewelleryType.map((type) => (
                  <Box
                    key={type}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      py: 0.5,
                    }}
                  >
                    <Checkbox
                      id={`type-${type}`}
                      size="small"
                      value={type}
                      checked={(searchFilter?.search?.typeList || []).includes(type as JewelleryType)}
                      onChange={handleTypeSelect}
                      sx={{
                        p: 0.5,
                        color: '#bdbdbd',
                        '&.Mui-checked': {
                          color: '#1976d2',
                        },
                      }}
                    />
                    <Box
                      component="label"
                      htmlFor={`type-${type}`}
                      sx={{
                        ml: 1,
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: (searchFilter?.search?.typeList || []).includes(type as JewelleryType) ? 500 : 400,
                        color: (searchFilter?.search?.typeList || []).includes(type as JewelleryType)
                          ? '#1976d2'
                          : 'inherit',
                      }}
                    >
                      {type}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Fade>
          )}
        </Paper>

        {/* Options Filter Section */}
        {/* <Paper elevation={0} sx={{ p: 2, bgcolor: '#fafafa', borderRadius: 2 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              mb: expandedSections.options ? 2 : 0,
            }}
            onClick={() => toggleSection('options')}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CategoryIcon color="primary" fontSize="small" />
              <Typography variant="subtitle1" fontWeight={600}>
                Options
              </Typography>

              {searchFilter?.search?.options?.length > 0 && (
                <Chip
                  size="small"
                  label={searchFilter.search.options.length}
                  color="primary"
                  sx={{ height: 20, fontSize: '0.7rem' }}
                />
              )}
            </Box>

            {expandedSections.options ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Box>

          {expandedSections.options && (
            <Fade in={expandedSections.options}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox
                    id="option-barter"
                    size="small"
                    value="jewelleryBarter"
                    checked={(searchFilter?.search?.options || []).includes('jewelleryBarter')}
                    onChange={handleOptionSelect}
                    sx={{
                      p: 0.5,
                      color: '#bdbdbd',
                      '&.Mui-checked': {
                        color: '#1976d2',
                      },
                    }}
                  />
                  <Box
                    component="label"
                    htmlFor="option-barter"
                    sx={{
                      ml: 1,
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: (searchFilter?.search?.options || []).includes('jewelleryBarter') ? 500 : 400,
                      color: (searchFilter?.search?.options || []).includes('jewelleryBarter') ? '#1976d2' : 'inherit',
                    }}
                  >
                    Barter
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox
                    id="option-rent"
                    size="small"
                    value="jewelleryRent"
                    checked={(searchFilter?.search?.options || []).includes('jewelleryRent')}
                    onChange={handleOptionSelect}
                    sx={{
                      p: 0.5,
                      color: '#bdbdbd',
                      '&.Mui-checked': {
                        color: '#1976d2',
                      },
                    }}
                  />
                  <Box
                    component="label"
                    htmlFor="option-rent"
                    sx={{
                      ml: 1,
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: (searchFilter?.search?.options || []).includes('jewelleryRent') ? 500 : 400,
                      color: (searchFilter?.search?.options || []).includes('jewelleryRent') ? '#1976d2' : 'inherit',
                    }}
                  >
                    Rent
                  </Box>
                </Box>
              </Box>
            </Fade>
          )}
        </Paper> */}

        {/* Price Range Filter Section */}
        <Paper elevation={0} sx={{ p: 2, bgcolor: '#fafafa', borderRadius: 2 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              mb: expandedSections.price ? 2 : 0,
            }}
            onClick={() => toggleSection('price')}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AttachMoneyIcon color="black" fontSize="small" />
              <Typography variant="subtitle1" fontWeight={600}>
                Price Range
              </Typography>
            </Box>

            {expandedSections.price ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Box>

          {expandedSections.price && (
            <Fade in={expandedSections.price}>
              <Box sx={{ px: 2, pt: 1 }}>
                <Slider
                  value={priceRange}
                  onChange={handlePriceChange}
                  onChangeCommitted={handlePriceCommitted}
                  valueLabelDisplay="auto"
                  min={0}
                  max={10000}
                  step={100}
                  valueLabelFormat={(value) => `$${value}`}
                />

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 1,
                  }}
                >
                  <Box
                    sx={{
                      p: 1,
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      width: '45%',
                      textAlign: 'center',
                      bgcolor: '#fff',
                    }}
                  >
                    ${priceRange[0]}
                  </Box>

                  <Box
                    sx={{
                      p: 1,
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      width: '45%',
                      textAlign: 'center',
                      bgcolor: '#fff',
                    }}
                  >
                    ${priceRange[1]}
                  </Box>
                </Box>
              </Box>
            </Fade>
          )}
        </Paper>

        {/* Active Filters Section */}
        {(searchFilter?.search?.locationList?.length > 0 ||
          searchFilter?.search?.typeList?.length > 0 ||
          searchFilter?.search?.options?.length > 0 ||
          searchFilter?.search?.text) && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Active Filters
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {searchFilter?.search?.text && (
                <Chip
                  label={`Search: ${searchFilter.search.text}`}
                  onDelete={() => {
                    setSearchText('');
                    setSearchFilter({
                      ...searchFilter,
                      search: { ...searchFilter.search, text: '' },
                    });
                  }}
                  size="small"
                />
              )}

              {searchFilter?.search?.locationList?.map((location) => (
                <Chip
                  key={`loc-${location}`}
                  label={location}
                  onDelete={async () => {
                    const newLocations = searchFilter.search.locationList.filter((l) => l !== location);
                    await router.push(
                      `/jewellery?input=${JSON.stringify({
                        ...searchFilter,
                        search: { ...searchFilter.search, locationList: newLocations },
                      })}`,
                      `/jewellery?input=${JSON.stringify({
                        ...searchFilter,
                        search: { ...searchFilter.search, locationList: newLocations },
                      })}`,
                      { scroll: false },
                    );
                  }}
                  size="small"
                />
              ))}

              {searchFilter?.search?.typeList?.map((type) => (
                <Chip
                  key={`type-${type}`}
                  label={type}
                  onDelete={async () => {
                    const newTypes = searchFilter.search.typeList.filter((t) => t !== type);
                    await router.push(
                      `/jewellery?input=${JSON.stringify({
                        ...searchFilter,
                        search: { ...searchFilter.search, typeList: newTypes },
                      })}`,
                      `/jewellery?input=${JSON.stringify({
                        ...searchFilter,
                        search: { ...searchFilter.search, typeList: newTypes },
                      })}`,
                      { scroll: false },
                    );
                  }}
                  size="small"
                />
              ))}

              {searchFilter?.search?.options?.includes('jewelleryBarter') && (
                <Chip
                  label="Barter"
                  onDelete={async () => {
                    const newOptions = searchFilter.search.options.filter((o) => o !== 'jewelleryBarter');
                    await router.push(
                      `/jewellery?input=${JSON.stringify({
                        ...searchFilter,
                        search: { ...searchFilter.search, options: newOptions },
                      })}`,
                      `/jewellery?input=${JSON.stringify({
                        ...searchFilter,
                        search: { ...searchFilter.search, options: newOptions },
                      })}`,
                      { scroll: false },
                    );
                  }}
                  size="small"
                />
              )}

              {searchFilter?.search?.options?.includes('jewelleryRent') && (
                <Chip
                  label="Rent"
                  onDelete={async () => {
                    const newOptions = searchFilter.search.options.filter((o) => o !== 'jewelleryRent');
                    await router.push(
                      `/jewellery?input=${JSON.stringify({
                        ...searchFilter,
                        search: { ...searchFilter.search, options: newOptions },
                      })}`,
                      `/jewellery?input=${JSON.stringify({
                        ...searchFilter,
                        search: { ...searchFilter.search, options: newOptions },
                      })}`,
                      { scroll: false },
                    );
                  }}
                  size="small"
                />
              )}
            </Box>
          </Box>
        )}
      </Stack>
    </Paper>
  );
};

export default Filter;
