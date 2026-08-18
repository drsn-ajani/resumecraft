import React, { useState } from 'react';
import {List,arrayMove} from 'react-movable'

import axios from 'axios';
import CodingProfilesSection from './CodingProfilecmp.jsx';
import EducationSection from './educationcmp.jsx';
import SkillsSection from './skillscmp.jsx';
import ExperienceSection from './Experiencecmp.jsx';
import ProjectsSection from './Projectcmp.jsx';
import GeneralBulletCmp from './generalbulletcmp.jsx';
import ResponsibilitySection from './PositionofResponsibilitycmp.jsx';
import CertificationsSection from './Certificationsection.jsx';
import './App.css';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

api.interceptors.request.use((config) => {
  console.log(`[AXIOS] ${config.method?.toUpperCase()} -> ${new URL(config.url, config.baseURL).href}`);
  return config;
});

const App = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [linkedinusrn, setLinkedinusrn] = useState('');
  const [portfolio, setPortfolio] = useState('');
  // const [codingProfile, setCodingProfile] = useState('');
  // const [codingProfileplatname, setCodingProfileplatname] = useState('');
  const [codingProfiles, setCodingProfiles] = useState([]);
  const [github, setGithub] = useState('');
  const [githubusrn, setGithubusrn] = useState('');
  const [objective, setObjective] = useState('');
  const [latexCode, setLatexCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activities, setActivities] = useState([]);
  const [responsibilities, setResponsibilities] = useState([]);
  const [certifications, setCertifications] = useState([]); // New State for Certifications
 // const [items,setItems]= useState(['Item1','Item2','Item3','Item4','Item5','Item6']);
 const [items, setItems] = useState([
  { id: 'experience', label: 'Experience', dataKey: 'experience' },
  { id: 'education', label: 'Education', dataKey: 'education' },
  { id: 'skills', label: 'Skills', dataKey: 'skills' },
  { id: 'projects', label: 'Projects', dataKey: 'projects' },
  { id: 'activities', label: 'Activities', dataKey: 'activities' },
  { id: 'certifications', label: 'Certifications', dataKey: 'certifications' },
  { id: 'responsibilities', label: 'Responsibilities', dataKey: 'responsibilities' },
]);

  
  const handleGenerateLatex = async () => {
    if (!firstName || !lastName || !phone || !email) {
      setErrorMessage('Please fill in all required fields: First Name, Last Name, Phone, and Email.');
      return;
    }

    setErrorMessage('');
    try {
      const response = await api.post('/users', {
        firstName,
        lastName,
        phone,
        email,
        address,
        linkedin,
        linkedinusrn,
        portfolio,
        codingProfiles,
        github,
        githubusrn,
        objective,
        education,
        skills,
        experience,
        projects,
        activities,
        responsibilities,
        certifications, // Add certifications to API payload
      });
      setLatexCode(response.data.latexCode);
    } catch (error) {
      console.error('Error sending data:', error);
      setErrorMessage('An error occurred while sending data. Please try again.');
    }
  };

  const handleFetchLatex = async () => {
    try {
      const response = await api.get('/generate-latex', {
        responseType: 'text',
      });
      setLatexCode(response.data);
    } catch (error) {
      console.error('Error fetching LaTeX:', error);
      setErrorMessage('An error occurred while fetching LaTeX data. Please try again.');
    }
  };

  const handleDownloadResumeCls = () => {
    const link = document.createElement('a');
    link.href = 'https://drive.google.com/file/d/126BT3NS6ya__GCpS8osKLKdme0kAVPVX/view?usp=sharing';
    link.download = 'resume.cls';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const dataMap = {
    experience: { data: experience, onUpdate: setExperience },
    education: { data: education, onUpdate: setEducation },
    skills: { data: skills, onUpdate: setSkills },
    projects: { data: projects, onUpdate: setProjects },
    activities: { data: activities, onUpdate: setActivities },
    certifications: { data: certifications, onUpdate: setCertifications },
    responsibilities: { data: responsibilities, onUpdate: setResponsibilities },
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>LaTeX Resume Builder</h1>

      <div
      style={{
        border: '1px solid #ddd6fe',
        borderLeft: '6px solid #7c3aed',
        padding: '15px',
        borderRadius: '8px',
        backgroundColor: '#f5f3ff',
        marginBottom: '20px',
      }}
    >
      <h2>How to Use</h2>
      <ol style={{ paddingLeft: '20px' }}>
        <li>
          <strong>Glad to have you here!</strong> In just three steps, this tool turns the details you type in into a ready-to-use LaTeX resume.
        </li>
        <li>
          Grab the <strong>resume.cls</strong> file from the button at the bottom. All the styling rules live inside it. Bringing your own file works too, as long as its filename and section names line up with this one.
        </li>
        <li>
          Head over to Overleaf, start a fresh project there, and upload the <strong>resume.cls</strong> file into it.
        </li>
        <li>
          Drag the section cards until the sequence suits you, complete the form underneath, then press <strong>Generate LaTeX</strong> to build the code. Press <strong>Fetch LaTeX</strong> to pull it back, and it will show up in the LaTeX Code box lower down. From there, copy it across into your <code>main.tex</code> and hit <strong>Compile</strong>.
        </li>
        <li>
          <strong>All done!</strong> Download it and your LaTeX resume is yours.
        </li>
      </ol>
      <p style={{ fontStyle: 'italic', color: '#5b21b6' }}>
        Note 1: Edited something? Press <strong>Generate LaTeX</strong> once more before you fetch, otherwise you will pull the older version.
      </p>
      <p style={{ fontStyle: 'italic', color: '#5b21b6' }}>
        Note 2: Among the built-in fields, only first name, last name, phone and email have to be filled. Everything else is yours to skip or include as you like. Whenever you add a block such as Add Project, put something in the required boxes, because leaving the block entirely blank causes an error. Not planning to use it? Just hit remove.
             </p>
    </div>

      {errorMessage && (
        <div
          style={{
            color: '#b91c1c',
            marginBottom: '20px',
            border: '1px solid #fca5a5',
            borderLeft: '6px solid #dc2626',
            padding: '10px',
            borderRadius: '5px',
            backgroundColor: '#fef2f2',
          }}
        >
          {errorMessage}
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        {/* Input Fields */}
        <input type="text" placeholder="First Name (Required)" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={{ marginRight: '10px', padding: '5px' }} />
        <input type="text" placeholder="Last Name (Required)" value={lastName} onChange={(e) => setLastName(e.target.value)} style={{ marginRight: '10px', padding: '5px' }} />
        <input type="text" placeholder="Phone (Required)" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ marginRight: '10px', padding: '5px' }} />
        <input type="email" placeholder="Email (Required)" value={email} onChange={(e) => setEmail(e.target.value)} style={{ marginRight: '10px', padding: '5px' }} />
        <input type="text" placeholder="City, State" value={address} onChange={(e) => setAddress(e.target.value)} style={{ marginRight: '10px', padding: '5px' }} />
        <input type="text" placeholder="LinkedIn Username /Linkdein" value={linkedinusrn} onChange={(e) => setLinkedinusrn(e.target.value)} style={{ marginRight: '10px', padding: '5px' }} />
        <input type="text" placeholder="LinkedIn Link" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} style={{ marginRight: '10px', padding: '5px' }} />
        <input type="text" placeholder="Portfolio Link" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} style={{ marginRight: '10px', padding: '5px' }} />
        <CodingProfilesSection
        codingProfiles={codingProfiles}
        onAdd={() => setCodingProfiles([...codingProfiles, { platform: '', link: '' }])}
        onRemove={(index) =>
          setCodingProfiles(codingProfiles.filter((_, i) => i !== index))
        }
        onUpdate={(updatedProfiles) => setCodingProfiles(updatedProfiles)}
      />
        <input type="text" placeholder="GitHub Username / Github" value={githubusrn} onChange={(e) => setGithubusrn(e.target.value)} style={{ marginRight: '10px', padding: '5px' }} />
        <input type="text" placeholder="GitHub Link" value={github} onChange={(e) => setGithub(e.target.value)} style={{ marginRight: '10px', padding: '5px' }} />
      </div>

      <textarea placeholder="Objective" value={objective} onChange={(e) => setObjective(e.target.value)} style={{ width: '100%', height: '50px', marginBottom: '10px' }}></textarea>
      <div>
      <List
        values={items}
        onChange={({ oldIndex, newIndex }) => {
          // Update item order
          const updatedItems = arrayMove(items, oldIndex, newIndex);
          setItems(updatedItems);

          // Save the new order to the backend
          const newOrder = updatedItems.map((item) => item.id);
          axios
            .post('/api/save-order', { order: newOrder })
            .then((response) => {
              console.log('Order updated successfully:', response.data);
            })
            .catch((error) => {
              console.error('Error updating order:', error);
            });
        }}
        renderList={({ children, props }) => (
          <ul {...props} style={{ padding: 0, listStyle: 'none' }}>
            {children}
          </ul>
        )}
        renderItem={({ value, props, isDragged }) => {
          const { key, ...restProps } = props; // Destructure and explicitly pass key
          const section = dataMap[value.dataKey]; // Get data and onUpdate for this item

          return (
            <li
              key={key}
              {...restProps}
              style={{
                ...restProps.style,
                padding: '10px',
                border: '1px solid #ddd6fe',
                borderRadius: '5px',
                marginBottom: '10px',
                backgroundColor: isDragged ? '#ede9fe' : 'white',
                cursor: isDragged ? 'grabbing' : 'grab',
              }}
            >
              {/* Dynamically render the component with appropriate data */}
              {value.id === 'experience' && (
                <ExperienceSection
                  experienceData={section.data}
                  onUpdate={section.onUpdate}
                />
              )}
              {value.id === 'education' && (
                <EducationSection
                  educationData={section.data}
                  onUpdate={section.onUpdate}
                />
              )}
              {value.id === 'skills' && (
                <SkillsSection skillsData={section.data} onUpdate={section.onUpdate} />
              )}
              {value.id === 'projects' && (
                <ProjectsSection
                  projectsData={section.data}
                  onUpdate={section.onUpdate}
                />
              )}
              {value.id === 'activities' && (
                <GeneralBulletCmp
                  bulletsData={section.data}
                  onUpdate={section.onUpdate}
                />
              )}
              {value.id === 'certifications' && (
                <CertificationsSection
                  certificationsData={section.data}
                  onUpdate={section.onUpdate}
                />
              )}
              {value.id === 'responsibilities' && (
                <ResponsibilitySection
                  data={section.data}
                  onUpdate={section.onUpdate}
                />
              )}
            </li>
          );
        }}
      />
    </div>

     
     

      <button onClick={handleGenerateLatex} style={{ padding: '10px 20px', marginRight: '10px' }}>
        Generate LaTeX
      </button>
      <button onClick={handleFetchLatex} style={{ padding: '10px 20px', marginRight: '10px' }}>
        Fetch LaTeX
      </button>
      <button onClick={handleDownloadResumeCls} style={{ padding: '10px 20px' }}>
        Download resume.cls
      </button>

      <h2>Generated LaTeX Code</h2>
      <textarea
        value={latexCode}
        onChange={(e) => setLatexCode(e.target.value)}
        style={{
          width: '100%',
          height: '300px',
          background: '#f5f3ff',
          padding: '10px',
          borderRadius: '5px',
          fontFamily: 'monospace',
        }}
      ></textarea>
         <footer
      style={{
        textAlign: 'center',
        padding: '10px',
        marginTop: '20px',
        borderTop: '1px solid #ddd6fe',
        backgroundColor: '#f5f3ff',
        fontSize: '14px',
        color: '#5b21b6',
      }}
    >
      Created with ❤️ by Darshan © 2026
    </footer>
    </div>
  );
};

export default App;