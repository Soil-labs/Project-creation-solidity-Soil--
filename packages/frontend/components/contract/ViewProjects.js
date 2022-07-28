import { useEffect, useState, useCallback } from 'react';
import { useContract, useProvider } from 'wagmi';
import { useAccount, useConnect, useDisconnect, useSigner } from "wagmi";
import { InjectedConnector } from 'wagmi/connectors/injected'
import contracts from '../../contracts/hardhat_contracts.json';
import { NETWORK_ID } from '../../config';
import {useRouter} from 'next/router';


export const ViewProjects = () => {
    const chainId = Number(NETWORK_ID);
    const [numberOfProjects, setNumberOfProjects] = useState(0);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();
    //const provider = useProvider();
    const { data: signerData } = useSigner();
    const allContracts = contracts;
    const greeterAddress = allContracts[chainId][0].contracts.ProjectFactory.address;
    const greeterABI = allContracts[chainId][0].contracts.ProjectFactory.abi;
    //const { data: accountData } = useAccount();
    const greeterContract = useContract({
      addressOrName: greeterAddress,
      contractInterface: greeterABI,
      signerOrProvider: signerData,
    });
  
    const { address, isConnected } = useAccount()
    const { connect } = useConnect({
      connector: new InjectedConnector(),
    })
    const { disconnect } = useDisconnect()
  
    const fetchData = async () => {
      try {
        const _numberOfProjects = await greeterContract.numberOfProjects(address);
        setNumberOfProjects(_numberOfProjects);
        setError('');
        await getProjects(_numberOfProjects)
      } catch (error) {
        console.log(error)
        setError("Contract couldn't be fetched.  Please check your network.");
      }
      setLoading(false);
    };
  
  
    const getProjects = async (_numberOfProjects) => {
      let temp = []
      for (let i = 0; i < _numberOfProjects; i++) {
        let project = await greeterContract.projects(address,i);
        temp.push(project)
      }
      setProjects(temp)
    }

    const projectClickHandeler = (add) => {
        router.push('/project/' + add)
    }
    useEffect(() => {
      if (signerData && address) {
        fetchData();
        
      }
    }, [signerData, greeterContract, fetchData]);
    if(!isConnected){
      return <button onClick={() => connect()}>Connect Wallet</button>
    }
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (error) {
      return <div>{error}</div>;
    }
    if(projects.length > 0) {
        return(
            <ul>
                {projects.map((project) => {
                    return(
                    <li onClick={() => projectClickHandeler(project[0])}>
                      <button>
                        {project[1]}
                      </button>
                    </li>)
                })}
            </ul>
        )
    }
    return (
        <h5>No Projects</h5>
    )
  };
  