import {useRouter} from 'next/router'
import { useEffect, useState, useCallback } from 'react';
import { useContract, useProvider, useSigner } from 'wagmi';
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from 'wagmi/connectors/injected';
import contracts from '../../contracts/hardhat_contracts.json';
import { NETWORK_ID } from '../../config';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Project () {
    const chainId = Number(NETWORK_ID);
    const provider = useProvider();
    const { data: signerData } = useSigner();
    const allContracts = contracts;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [addDev, setAddDev] = useState('');
    const [revokeDev, setRevokeDev] = useState('');
    const [getDev, setGetDev] = useState('');
    const [showDev, setShowDev] = useState();
    const [roles, setRoles] = useState('');
    const router = useRouter()
    const address = router.query.id;
    const greeterAddress = address? address : allContracts[chainId][0].contracts.Project.address;
    const greeterABI = allContracts[chainId][0].contracts.Project.abi;
    const greeterContract = useContract({
        addressOrName: greeterAddress,
        contractInterface: greeterABI,
        signerOrProvider: signerData,
      });

    const fetchData = async () => {
        try {
          const _nameOfProject = await greeterContract.name();
          const _owner = await greeterContract.owner();
          console.log(_nameOfProject)
          console.log(address)
          console.log(greeterAddress)
          console.log(_owner)
        } catch (error) {
          console.log(error)
          setError("Contract couldn't be fetched.  Please check your network.");
        }
        setLoading(false);
      };

    const handleAddMember = async (e)  => {
        e.preventDefault();
        try {
        setLoading(true);
        const tx = await greeterContract.addMember(addDev, roles);
        await tx.wait();
        setAddDev('');
        setRoles('');
        setLoading(false);
        } catch (error) {
        console.log(error)
        setError('txn failed, check contract');
        setLoading(false);
        }
    }
    const handleRevoke = async (e)  => {
        e.preventDefault();
        try {
        setLoading(true);
        const tx = await greeterContract.revokeMember(revokeDev);
        await tx.wait();
        setRevokeDev('');
        setLoading(false);
        } catch (error) {
        console.log(error)
        setError('txn failed, check contract');
        setLoading(false);
        }
    }
    const handleGetDev = async (e)  => {
        e.preventDefault();
        try {
        setLoading(true);
        console.log(getDev)
        const dev = await greeterContract.Members(getDev);
        //await tx.wait();
        console.log(dev)
        setShowDev(dev);
        setGetDev('');
        setLoading(false);
        } catch (error) {
        console.log(error)
        setError('txn failed, check contract');
        setLoading(false);
        }
    }
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
    // useEffect(() => {
        
    // }, [provider, greeterContract, fetchData]);
    if (error) {
        return <div>{error}</div>;
    }
    return(
        <div style={{ margin: '20px' }}>
            
            {/* <header style={{ padding: '1rem' }}>
                <ConnectButton />
            </header> */}
            <main
              style={{
                minHeight: '60vh',
                flex: '1',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
            <h5>Add Dev</h5>
            <form style={{
                flex: '1',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }} onSubmit={(e) => handleAddMember(e)}>
                <input
                required
                value={addDev}
                placeholder="Developer's Address"
                onChange={(e) => setAddDev(e.target.value)}
                />
                <input
                required
                value={roles}
                placeholder="Roles"
                onChange={(e) => setRoles(e.target.value)}
                />
                <button style={{ marginLeft: '20px' }} type="submit">
                submit
                </button>
            </form>
            {/* {/* <form onSubmit={(e) => handleSubmit(e)}>
                <input
                required
                value={champAdd}
                placeholder="Champ's Address"
                onChange={(e) => setChampAdd(e.target.value)}
                />
                <input
                required
                value={projectName}
                placeholder="Project Name"
                onChange={(e) => setProjectName(e.target.value)}
                />
                <input
                required
                value={projectDesc}
                placeholder="Project Desc"
                onChange={(e) => setProjectDesc(e.target.value)}
                />
                <button style={{ marginLeft: '20px' }} type="submit">
                submit
                </button>
            </form> */}
            <h5>Revoke Dev</h5>
            <form style={{
                flex: '1',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }} onSubmit={(e) => handleRevoke(e)}>
                <input
                required
                value={revokeDev}
                placeholder="Developer's Address"
                onChange={(e) => setRevokeDev(e.target.value)}
                />
                <button style={{ marginLeft: '20px' }} type="submit">
                submit
                </button>
            </form>
            <h5>Get Dev</h5>
            <form style={{
                flex: '1',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }} onSubmit={(e) => handleGetDev(e)}>
                <input
                required
                value={getDev}
                placeholder="Developer's Address"
                onChange={(e) => setGetDev(e.target.value)}
                />
                <button style={{ marginLeft: '20px' }} type="submit">
                submit
                </button>
            </form>
            {showDev && (
                <>
                    <h6>Address: {showDev.member}</h6>
                    <h6>Role: {showDev.role}</h6>
                    <h6>Access: {showDev.access? 'true':'False'}</h6>
                </>
                
            )}
          </main>
        </div>
    )
}