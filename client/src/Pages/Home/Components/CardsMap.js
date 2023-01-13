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
        console.log('age:', ageRange, ' distance:', distanceRange, ' fame:',fameRange, ' commontag:', commonTags)

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
                console.log(response.data);
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
                <AiFillFire className='w-full h-full text-red-700 bg-transparent absolute bottom-1'/>
            </SliderThumb>
        );
    }

    FireThumbComponent.propTypes = {
        children: PropTypes.node,
    };

    const handleSortByDirection = (event, direction) => {
        setSortDirection(direction);
        console.log(sortBy, direction);
        const sort = sortBy + ' ' + direction;
        executeSort(sort);
    }

    const executeSort = (sort) => {
        switch (sort) {
            case 'fame descending':
                console.log(sort)
                setUsers(users.sort((a, b) => b.fame_rating - a.fame_rating));
                break;
            case 'fame ascending':
                console.log(sort)
                setUsers(users.sort((a, b) => a.fame_rating - b.fame_rating));
                break;
            case 'distance descending':
                console.log(sort)
                setUsers(users.sort((a, b) => b.distance - a.distance));
                break;
            case 'distance ascending':
                console.log(sort)
                setUsers(users.sort((a, b) => a.distance - b.distance));
                break;
            case 'age descending':
                console.log(sort)
                console.log(users[0]);
                setUsers(users.sort((a, b) => b.age - a.age));
                console.log(users[0]);
                break;
            case 'age ascending':
                console.log(sort)
                console.log(users[0]);
                setUsers(users.sort((a, b) => a.age - b.age));
                console.log(users[0]);
                break;
            default:
                console.log('switch case unknown');
        }
    }

    const handleSortByChange = (event) => {
        setSortBy(event.target.value);
        console.log(event.target.value, sortDirection);
        const sort = event.target.value + ' ' + sortDirection;
        executeSort(sort);
    };

    useEffect(() => {
        window.addEventListener('scroll', () => {
            setShowTopBtn(true);
        });
    }, []);

    useEffect(() => {
        api.get(`http://localhost:3001/users/${currentUser.id}/bachelors`)
            .then(response => {
                setUsers(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error(error);
            });
    }, [currentUser]);

    return (
        <>
            <div className='mt-16'>
                <div className='flex items-center justify-center gap-4 pt-2'>
                    <label htmlFor="my-modal" className="btn h-16 bg-chess-dark">Filters</label>
                    <input type="checkbox" id="my-modal" className="modal-toggle" />
                    <div className="modal">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">Profiles search filter</h3>
                            <p className="py-4">Set filters to browse profiles matching your preferences.</p>
                            <h3 className="font-bold text-lg">Age {ageRange[0]}-{ageRange[1]}</h3>
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
                            <h3 className="font-bold text-lg">Distance {distanceRange[0]}-{distanceRange[1]}km</h3>
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
                            <h3 className="font-bold text-lg">Minimum common tags</h3>
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
                            <h3 className="font-bold text-lg">Fame</h3>
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

                    <FormControl className='bg-chess-dark rounded-lg w-40'>
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

                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                    {users.map((user, index) => (
                        <li key={user + index} id={user + index} className="flex">
                            <ProfileCard user={user} isLoading={isLoading} />
                        </li>
                    ))}
                </ul>

                {
                    showTopBtn &&
                    <button onClick={(event) => { window.scrollTo({ top: 0, behavior: 'smooth' }) }} className='btn btn-circle bg-orange-500 fixed bottom-5 right-5'>
                        <HiArrowUp className='h-6 w-6'/>
                    </button>
                }

            </div>
        </>
    )
}

export default CardsMap;