import React from 'react';
import { followSeller, unFollowSeller } from '../../firebase/firebase-utility';

const FollowUser = ({ user, sellerId, loginPop, followers, updateFollowers }) => {
    let isFollowing = false;
    user && (isFollowing = followers.find(id => id === user.uid));
    const followHandler = () => user ? follow() : loginPop(follow);

    const follow = (usr = user) => {
        followSeller(sellerId, usr.uid)
            .then(_ => {
                const newFollowers = [...followers, usr.uid];
                updateFollowers(newFollowers);
            });
    }

    const unFollow = () => {
        unFollowSeller(sellerId, user.uid)
            .then(_ => {
                const newFollowers = followers.filter(id => id !== user.uid);
                updateFollowers(newFollowers);
            });
    }

    return (
        <button className='follow btn primary' onClick={isFollowing ? unFollow : followHandler}>
            {isFollowing && 'un'}follow
        </button>
    )
}

export default FollowUser;