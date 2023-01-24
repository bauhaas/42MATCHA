import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import Slider, { SliderThumb } from '@mui/material/Slider';
import { AiFillFire } from 'react-icons/ai';
import { HiArrowUp } from 'react-icons/hi';
import { BiSortDown, BiSortUp } from 'react-icons/bi';

import ProfileCard from './ProfileCard';
import api from '../../../ax';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Skeleton from '@mui/material/Skeleton';


const CardsMap = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showTopBtn, setShowTopBtn] = useState(false);
	const currentUser = useSelector((state) => state.user.user);
    const minDistance = 1;
    const [ageRange, setAgeRange] = useState([18, 34]);
    const [distanceRange, setDistanceRange] = useState([0, 50]);
    const [fameRange, setFameRange] = useState(0);
    const [commonTags, setCommonTags] = useState(0);
    const [sortDirection, setSortDirection] = useState('ascending');
    const [sortBy, setSortBy] = useState('');

    const handleAgeChange = (event, newValue, activeThumb) => {
        if (!Array.isArray(newValue))
            return;
        if (activeThumb === 0)
            setAgeRange([Math.min(newValue[0], ageRange[1] - minDistance), ageRange[1]]);
        else
            setAgeRange([ageRange[0], Math.max(newValue[1], ageRange[0] + minDistance)]);

    };

    const handleDistanceChange = (event, newValue, activeThumb) => {
        if (!Array.isArray(newValue))
            return;

        if (activeThumb === 0)
            setDistanceRange([Math.min(newValue[0], distanceRange[1] - minDistance), distanceRange[1]]);
        else
            setDistanceRange([distanceRange[0], Math.max(newValue[1], distanceRange[0] + minDistance)]);
    };

    const handleCommonTagsChange = (event, newValue) => {
        // Find mark object with matching value
        const mark = marks.find(mark => mark.value === newValue);
        // Retrieve mark label
        const label = mark ? mark.label : '0';
        setCommonTags(Number(label));
    };

    const handleFameChange = (event, newValue) => {
        setFameRange(newValue);
    };

    const sendFilters = async (event) => {
        await api.post(`http://localhost:3001/users/${currentUser.id}/filteredBachelors/`, {
            min_age: ageRange[0],
            max_age: ageRange[1],
            min_distance: distanceRange[0],
            max_distance: distanceRange[1],
            min_fame: fameRange,
            min_common_interests: commonTags,
            max_common_interests: 100
        })
            .then(response => {
                setUsers(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.log(error);
            });
    };

    const marks = [
        {
            value: 0,
            label: '0',
        },
        {
            value: 20,
            label: '1',
        },
        {
            value: 40,
            label: '2',
        },
        {
            value: 60,
            label: '3',
        },
        {
            value: 80,
            label: '4',
        },
        {
            value: 100,
            label: '5',
        },
    ];

    function FireThumbComponent(props) {
        const { children, ...other } = props;
        return (
            <SliderThumb {...other}>
                {children}
                <AiFillFire className='absolute w-full h-full text-red-700 bg-transparent bottom-1'/>
            </SliderThumb>
        );
    }

    FireThumbComponent.propTypes = {
        children: PropTypes.node,
    };

    const handleSortByDirection = (event, direction) => {
        setSortDirection(direction);
        const sort = sortBy + ' ' + direction;
        executeSort(sort);
    }

    const executeSort = (sort) => {
        switch (sort) {
            case 'fame descending':
                setUsers(users.sort((a, b) => b.fame_rating - a.fame_rating));
                break;
            case 'fame ascending':
                setUsers(users.sort((a, b) => a.fame_rating - b.fame_rating));
                break;
            case 'distance descending':
                setUsers(users.sort((a, b) => b.distance - a.distance));
                break;
            case 'distance ascending':
                setUsers(users.sort((a, b) => a.distance - b.distance));
                break;
            case 'age descending':
                setUsers(users.sort((a, b) => b.age - a.age));
                break;
            case 'age ascending':
                setUsers(users.sort((a, b) => a.age - b.age));
                break;
            default:
                return;
        }
    }

    const handleSortByChange = (event) => {
        setSortBy(event.target.value);
        const sort = event.target.value + ' ' + sortDirection;
        executeSort(sort);
    };

    useEffect(() => {
        window.addEventListener('scroll', () => {
            setShowTopBtn(true);
        });
    }, []);

    useEffect(() => {
        setTimeout(function () {
        api.get(`http://localhost:3001/users/${currentUser.id}/bachelors`)
            .then(response => {
                setUsers(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error(error);
            });
        }, 1000);
    }, [currentUser]);

    return (
        <>
            <div className='mt-16'>
                <div className='flex items-center justify-center gap-4 pt-2'>
                    <label htmlFor="my-modal" className="h-16 btn bg-chess-dark">Filters</label>
                    <input type="checkbox" id="my-modal" className="modal-toggle" />
                    <div className="modal">
                        <div className="modal-box">
                            <h3 className="text-lg font-bold">Profiles search filter</h3>
                            <p className="py-4">Set filters to browse profiles matching your preferences.</p>
                            <h3 className="text-lg font-bold">Age {ageRange[0]}-{ageRange[1]}</h3>
                            <Slider
                                value={ageRange}
                                onChange={handleAgeChange}
                                valueLabelDisplay="auto"
                                min={18}
                                max={99}
                                disableSwap
                                className="text-red-400"
                                slotProps={{
                                    thumb: {
                                        className: 'ring-0',
                                    }
                                }}
                            />
                            <h3 className="text-lg font-bold">Distance {distanceRange[0]}-{distanceRange[1]}km</h3>
                            <Slider
                                value={distanceRange}
                                onChange={handleDistanceChange}
                                min={0}
                                max={500}
                                valueLabelDisplay="auto"
                                disableSwap
                                className="text-chess-placeholder"
                                slotProps={{
                                    thumb: {
                                        className: 'ring-0'
                                    }
                                }}
                            />
                            <h3 className="text-lg font-bold">Minimum common tags</h3>
                            <Slider
                                defaultValue={0}
                                onChange={handleCommonTagsChange}
                                step={null}
                                className="text-red-400"
                                slotProps={{
                                    thumb: {
                                        className: 'rounded-sm ring-0'
                                    }
                                }}
                                marks={marks}
                            />
                            <h3 className="text-lg font-bold">Fame</h3>
                            <Slider
                                defaultValue={0}
                                valueLabelDisplay="auto"
                                onChange={handleFameChange}
                                slots={{ thumb: FireThumbComponent }}
                                className="h-4"
                                classes={{
                                    track: 'bg-gradient-to-r from-pink-100 to-red-500 border-0 ',
                                    rail: 'bg-red-200',
                                    thumb: 'hover:shadow-none  active:shadow-none h-12 w-12 bg-transparent ring-0 before:shadow-none'
                                }}
                            />
                            <div className="modal-action">
                                <label onClick={sendFilters} htmlFor="my-modal" className="btn bg-chess-button hover:bg-chess-hover">Confirm</label>
                            </div>

                        </div>
                    </div>

                    <div className='h-fit'>
                        {sortDirection === 'descending' ? (
                            <BiSortDown className={`btn ${sortBy ? null : 'btn-disabled text-chess-hover'} bg-chess-dark  h-16 w-16`} onClick={(event) => handleSortByDirection(event, 'ascending')} />
                        ) : (
                                <BiSortUp className={`btn ${sortBy ? null : 'btn-disabled text-chess-hover'} bg-chess-dark h-16 w-16`} onClick={(event) => handleSortByDirection(event, 'descending')} />
                        )}
                    </div>

                    <FormControl className='w-40 rounded-lg bg-chess-dark'>
                        <InputLabel id="demo-simple-select-label" className='text-white'>Sort by</InputLabel>
                        <Select
                            value={sortBy}
                            onChange={handleSortByChange}
                            className='text-white'
                        >
                            <MenuItem value={'age'}>Age</MenuItem>
                            <MenuItem value={'distance'}>Distance</MenuItem>
                            <MenuItem value={'fame'}>Fame</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7">
                    {
                        isLoading ?
                            Array(18).fill().map((_, i) => (
                                <li key={i} className='flex'>
                                    <div className="flex flex-col w-full min-h-full scale-90 rounded-md bg-chess-hover hover:bg-chess-dark group overflow h-fit">
                                        <Skeleton variant="rectangular" className='rounded-t-lg bg-chess-placeholder h-80 md:h-64' />
                                        <div className="flex flex-col p-1 grow min-h-1/2 max-h-1/2">
                                            <div className="flex flex-row items-center w-full">
                                                <Skeleton variant="text" className='w-full bg-chess-placeholder h-14' />
                                                <div className='relative m-4'>
                                                    <Skeleton variant="circular" className='w-10 h-10 bg-chess-placeholder' />
                                                </div>
                                            </div>
                                            <div className='mb-auto'>
                                                <Skeleton variant="text" className='w-full h-12 bg-chess-placeholder' />
                                                <Skeleton variant="text" className='w-full h-12 bg-chess-placeholder' />
                                                {
                                                    Array(5).fill().map((_, i) => (
                                                        <div key={i}>
                                                            <Skeleton variant="text" className={`bg-chess-placeholder w-${Math.floor(Math.random() * (60 - 40 + 1)) + 40}`} />
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                            <div className="flex flex-wrap gap-2 p-1">
                                            {
                                                    Array(3).fill().map((_, i) => (
                                                        <div key={i}>
                                                            <Skeleton variant="text" className='w-20 h-8 bg-chess-placeholder' />
                                                        </div>
                                                    ))
                                            }
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))
                        :
                        <>
                                {
                                    users.map((user, index) => (
                                        <li key={user + index} id={user + index} className="flex">
                                            <ProfileCard user={user} />
                                        </li>
                                    ))
                                }
                        </>

                    }

                </ul>

                {
                    showTopBtn &&
                    <button onClick={(event) => { window.scrollTo({ top: 0, behavior: 'smooth' }) }} className='fixed bg-orange-500 btn btn-circle bottom-5 right-5'>
                        <HiArrowUp className='w-6 h-6'/>
                    </button>
                }

            </div>
        </>
    )
}

export default CardsMap;