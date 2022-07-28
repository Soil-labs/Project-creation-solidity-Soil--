import React from 'react'
import contracts from '../../../contracts/hardhat_contracts.json';
import {useRouter} from 'next/router'
import { useEffect, useState, useCallback } from 'react';
import { useContract, useProvider, useSigner } from 'wagmi';
import { NETWORK_ID } from '../../../config';


const desc = () => {
  const chainId = Number(NETWORK_ID);
  const provider = useProvider();
  const allContracts = contracts;
  const { data: signerData } = useSigner();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectChamp, setProjectChamp] = useState('');
  const router = useRouter()
  const address = router.query.id;
  const projectAddress = address? address : allContracts[chainId][0].contracts.Project.address;
  const projectABI = allContracts[chainId][0].contracts.Project.abi;
  const projectContract = useContract({
        addressOrName: projectAddress,
        contractInterface: projectABI,
        signerOrProvider: signerData,
      });
  const fetchData = async () => {
        try {
          const _nameOfProject = await projectContract.name();
          const _owner = await projectContract.owner();
          const _desc = await projectContract.desc();
          const _numberOfMembers = await projectContract.numberOfMembers();
          var temp = []
          for(var i = 0; i < _numberOfMembers; i++) {
            const _add = await projectContract.membersAddresses(i)
            const _member = await projectContract.Members(_add);
            const _roles = await projectContract.getRoles(_add);
            temp.push({
              add: _add,
              access: _member.access,
              roles: _roles
            })
          }
          console.log(_nameOfProject)
          console.log(_owner)
          console.log(temp)
          setMembers(temp)
          //console.log(String(_numberOfMembers))
          setProjectChamp(_owner);
          setProjectDesc(_desc);
          setProjectName(_nameOfProject);
        } catch (error) {
          console.log(error)
          setError("Contract couldn't be fetched.  Please check your network.");
        }
        setLoading(false);
      };
  useEffect(() => {
    if (signerData) {
      setError('');
      setLoading(false);
      if (provider) {
        fetchData();
        
      }
    } else {
      setLoading(false);
      setError('please connect your wallet');
    }
  }, [signerData]);
    if (error) {
        return <div>{error}</div>;
    }
  return (
    <div style={{ margin: '20px' }}>
            
            {/* <header style={{ padding: '1rem' }}>
                <ConnectButton />
            </header> */}
            <main
              style={{

                flex: '1',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
            <h2>Name: {projectName}</h2>
            <h3>Champ: {projectChamp}</h3>
            <h4>Description: {projectDesc}</h4>
            <div>
              {members.length > 0 && (
                members.map((member) => {
                  if(member.access){
                  return(
                    <>
                      <h5>{member.add}</h5>
                      {member.roles.map((role) => <p>{role}</p>)}
                      <br></br>
                    </>
                    
                  )}
                })
              )}
            </div>
            </main>
    </div>
  )
}

export default desc