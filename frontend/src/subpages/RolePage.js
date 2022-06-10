import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Roles from '../components/Roles/Roles';
import Loading from '../pages/Loading/Loading';

const RolePage = (props) => {
    const [searchParams] = useSearchParams();
    //console.log('=========Mam jarni brouky v hlave=========');
    //console.log(searchParams.get('guild'));
    const roleLists = [];
    //console.log(roleLists.find(el => el.id === searchParams.get('guild')))
    //console.log(roleLists);
    //console.log(roleLists.map(el => el.id));
    if (props.guildInformation) {
        for (let guildName in props.guildInformation) {
            roleLists.push({ id: props.guildInformation[guildName].guildId, comp: <Roles serverInfo={{ ...props.guildInformation[guildName], guildName: guildName }} />})
        }        
    }
    //console.log('==========================================')
    
    return (
        roleLists.length > 0
            ? (roleLists.find(el => el.id === searchParams.get('guild'))).comp
            : <Loading />
    )
}

export default RolePage;