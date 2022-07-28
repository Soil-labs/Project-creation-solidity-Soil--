import {useRouter} from 'next/router'
import { useEffect, useState, useCallback } from 'react';
import { useContract, useProvider, useSigner } from 'wagmi';
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from 'wagmi/connectors/injected';
import contracts from '../../../contracts/hardhat_contracts.json';
import { NETWORK_ID } from '../../../config';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Select from 'react-select'


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
    const [roles, setRoles] = useState([]);
    const [chnageDev, setChangeDev] = useState('');
    const [newRoles, setNewRoles] = useState([]);
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
          console.log(_nameOfProject)
          console.log(_owner)
          setProjectChamp(_owner);
          setProjectDesc(_desc);
          setProjectName(_nameOfProject);
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
        const tx = await projectContract.addMember(addDev, roles);
        await tx.wait();
        setAddDev('');
        setRoles([]);
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
        const tx = await projectContract.revokeMember(revokeDev);
        await tx.wait();
        setRevokeDev('');
        setLoading(false);
        } catch (error) {
        console.log(error)
        setError('txn failed, check contract');
        setLoading(false);
        }
    }
    const handleChangeRole = async (e)  => {
      e.preventDefault();
      try {
      setLoading(true);
      const tx = await projectContract.changeRole(chnageDev, newRoles);
      await tx.wait();
      setChangeDev('');
      setNewRoles([]);
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
        const dev = await projectContract.Members(getDev);
        const devRoles = await projectContract.getRoles(getDev);
        //await tx.wait();
        console.log(dev)
        console.log(devRoles)
        let _ = {
          member: dev.member,
          roles: devRoles,
          access: dev.access 
        }
        setShowDev(_);
        setGetDev('');
        setLoading(false);
        } catch (error) {
        console.log(error)
        setError('txn failed, check contract');
        setLoading(false);
        }
    }
    const options = [
      { value: 'frontend', label: 'FrontEnd' },
      { value: 'backend', label: 'BackEnd' },
      { value: 'blockchain', label: 'BlockChain' },
      { value: 'ui/ux', label: 'UI/UX' },
      { value: 'hr', label: 'HR' },
      { value: 'devrel', label: 'DevRel' }
    ]
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
            <h2>Name: {projectName}</h2>
            <h3>Champ: {projectChamp}</h3>
            <h4>Description: {projectDesc}</h4>
            <button onClick={() => router.push('/project/' + projectAddress + '/desc')}>Details</button>
            <div style={{
                display: 'flex',
                //flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }} >
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                paddingRight: '80px',
              }}>
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
                    <Select
                      defaultValue={[]}
                      isMulti
                      name="colors"
                      options={options}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      onChange={(e) => setRoles(e.map((role) => role.value))} 
                    />
                    {!loading && <button style={{ marginLeft: '20px' }} type="submit">
                    submit
                    </button>}
                </form>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                //paddingRight: '80px',
              }}>
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
                    {!loading && <button style={{ marginLeft: '20px' }} type="submit">
                    submit
                    </button>}
                </form>
              </div>
              
            </div>
            <div style={{
                display: 'flex',
                //flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                paddingRight: '80px',
              }}>
                <h5>Change Dev Role</h5>
                <form style={{
                    flex: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }} onSubmit={(e) => handleChangeRole(e)}>
                    <input
                    required
                    value={chnageDev}
                    placeholder="Developer's Address"
                    onChange={(e) => setChangeDev(e.target.value)}
                    />
                    <Select
                      defaultValue={[]}
                      isMulti
                      name="Roles"
                      options={options}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      onChange={(e) => setNewRoles(e.map((role) => role.value))}
                      
                    />
                    {!loading && <button style={{ marginLeft: '20px' }} type="submit">
                    submit
                    </button>}
                </form>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                //paddingRight: '80px',
              }}>
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
                    {!loading && <button style={{ marginLeft: '20px' }} type="submit">
                    submit
                    </button>}
                </form>
                
                {showDev && (
                    <>
                        <h6>Address: {showDev.member}</h6>
                        <h6>Role: {showDev.roles.map((role) => String(role) + " ")} </h6>
                        <h6>Access: {showDev.access? 'true':'False'}</h6>
                    </>
                )}
              </div>
              
            </div>
            
          </main>
        </div>
    )
}