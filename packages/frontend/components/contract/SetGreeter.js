import { useEffect, useState } from 'react';
import { useContract, useSigner } from 'wagmi';

import contracts from '../../contracts/hardhat_contracts.json';
import { NETWORK_ID } from '../../config';
import Select from 'react-select'

export const SetGreeter = () => {
  const chainId = Number(NETWORK_ID);
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [adminRoles, setAdminRoles] = useState([]);
  const [champAdd, setChampAdd] = useState(''); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { data: signerData } = useSigner();

  const allContracts = contracts;
  const greeterAddress = allContracts[chainId][0].contracts.ProjectFactory.address;
  const greeterABI = allContracts[chainId][0].contracts.ProjectFactory.abi;

  const greeterContract = useContract({
    addressOrName: greeterAddress,
    contractInterface: greeterABI,
    signerOrProvider: signerData,
  });

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
    } else {
      setLoading(false);
      setError('please connect your wallet');
    }
  }, [signerData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const tx = await greeterContract.createProject(champAdd, projectName, projectDesc, adminRoles);
      await tx.wait();
      setProjectName('');
      setProjectDesc('');
      setChampAdd('')
      setAdminRoles([])
      setLoading(false);
    } catch (error) {
      console.log(error)
      setError('txn failed, check contract');
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ margin: '20px' }}>
      <form style={{
                    flex: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
       onSubmit={(e) => handleSubmit(e)}>
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
        <Select
          defaultValue={[options[2]]}
          isMulti
          name="colors"
          options={options}
          className="basic-multi-select"
          classNamePrefix="select"
          onChange={(e) => setAdminRoles(e.map((role) => role.value))}            
          />
        <button style={{ marginLeft: '20px' }} type="submit">
          submit
        </button>
      </form>
    </div>
  );
};
