import { ReactNode, useState, useEffect } from 'react';
import { ProjectData } from './components/ProjectData';
import './Navigation.css'; 
import ImageGallery from './components/ImageGallery';
import { Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';

interface ProjectLive {
    title: string;
    link: string;
    htmlSite: boolean;
}
const ProjectsLive: ProjectLive[] = [
    { title: "Simple Gear Simulation", link: 'https://dominikmat.github.io/simple-gear-calculator/', htmlSite:false},
    { title: "Old project webstie", link: 'https://dominikmat.github.io/portfolio_website/', htmlSite:false},
    { title: "Arc collisions HTML", link: '/dominik-home/circle-collisions/index.html', htmlSite:true},
    { title: "Softbody Simulation HTML", link: '/dominik-home/softbody simulation/index.html', htmlSite:true},
    { title: "Gravity Simulation HTML", link: '/dominik-home/gravity simulation/index.html', htmlSite:true},
    { title: "SPH Simulation HTML", link: '/dominik-home/sph fluid simulation/index.html', htmlSite:true},
    { title: "stronka zosi HTML", link: '/dominik-home/stronka zosi/stronkaZosi.html', htmlSite:true},
]

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [lineHeight, setLineHeight] = useState<number>(300);
  const [selectedProject, setSelectedProject] = useState<number>(0);
  
    useEffect(() => {
        switch (location.pathname) {
            case '/': 
                setLineHeight(300); break;
            case '/about': 
                setLineHeight(230); break;
            case '/live': 
                setLineHeight(ProjectsLive.length * 75); break;
            case '/projects': 
                setLineHeight(ProjectData.length * 132.5); break;
            default: 
                setLineHeight(300);
        }
    }, [location.pathname]);

  return (
    // Kontener do centrowania na ekranie
    <div className="portfolio-center-container">
      
      <div className="terminal-structure">
          <div className="top-line">
            {/* Show back button if we aren't on the home page */}
            { (location.pathname !== "/") && (
                <button className="top-back-arrow" onClick={() => navigate('/')}>
                  &lt;---
                </button>
                )}
            </div>
          <h1 className="name">Dominik Mat</h1>

        <div className="menu-container">

          <div className="animated-line"
            style={{ height: `${lineHeight}px` }}
          >
          </div>
        
        <Routes>

            {/* EMPTY PAGE REDIRECT */}
            {/* <Route path="/" element={<Navigate to="/" replace />} /> */}

            {/* DEFAUTL SECTION */}
            <Route path="/" element={
                <div className="links-wrapper">
                    <Link to="/about">about</Link>
                    <Link to="/projects">projects</Link>
                    <Link to="/live">websites live</Link>
                    <a href="https://github.com/DominikMat">github</a>
                </div>
            } />

            {/* ABOUT SECTION */}
            <Route path="/about" element={
                <div className="about-textbox">
                    <p> hello internet! </p>
                    <p> I'm Dominik, I like </p>
                    <p> making simulations & </p>
                    <p> graphics programming :) </p>
                </div>
            } />    
            
            {/* PROJCETS LIVE SECTION */}
            <Route path="/live" element={
                <div className='links-wrapper'>
                    {ProjectsLive.map((project, i) => (
                        <a 
                            key={i}
                            href={project.link} 
                            style={{
                                animationDelay: (0.225 * i) + 's', 
                                color: project.htmlSite ? '#4e4e4eff' : 'black',
                                fontSize: project.htmlSite ? '4ch' : '6ch'
                            }}
                        > 
                            {project.title} 
                        </a>
                    ))}
                </div>
            } />
            
            {/* PROJECT LIST SECTION */}
            <Route path="/projects" element={
                <div className='project-display'>
                        <div className="project-list" >
                            {
                                ProjectData.map((project,i) => (
                                    <button className="project-card" onClick={() => setSelectedProject(i)}
                                        style={{animationDelay:(0.35*i).toString()+'s'}}>
                                        { selectedProject == i ? (
                                            <div className="project-card-with-images">
                                                <div className="project-card-selected">
                                                    <div className="project-info">

                                                        <h1> [{i+1}] {project.title} </h1>
                                                        <p> {project.description} </p>
                                                        <br/>
                                                        <p> {project.details} </p>
                                                        
                                                        { project.startDate != project.endDate ? (
                                                            <p> {project.tag.toUpperCase()} | {project.startDate} - {project.endDate} </p>
                                                        ) : (
                                                            <p> {project.tag.toUpperCase()} | {project.endDate} </p>
                                                        )}

                                                    </div>

                                                    <div > </div>

                                                    { project.links.length != 0 ? 
                                                        <div className="project-line-separator">
                                                            <div className="project-column">
                                                                <h2> Links </h2>
                                                                { project.links.map( (l,i) => (
                                                                    <a href={l.url}> {l.title} </a>
                                                                ))}
                                                            </div>
                                                        </div> : null }
                                                    { project.stats.length != 0 ? 
                                                        <div className="project-line-separator">
                                                            <div className="project-column">
                                                                <h2> Stats </h2>
                                                                { project.stats.map( (s,i) => (
                                                                    <p> {s.label} | <i>{s.value}</i> </p>
                                                                ))}
                                                            </div>
                                                        </div> : null }

                                                </div>
                                            </div>
                                        ) : (
                                            <div className="project-card-small" style={{animationDelay:(0.35*i).toString()+'s'}}>
                                                <h1> [{i+1}] {project.title} </h1>
                                                <p> {project.description} </p>
                                                
                                                { project.startDate != project.endDate ? (
                                                    <p> {project.tag.toUpperCase()} | {project.startDate} - {project.endDate} </p>
                                                ) : (
                                                    <p> {project.tag.toUpperCase()} | {project.endDate} </p>
                                                )}
                                            </div>
                                        )}
                                    </button>
                                ))
                            }
                        </div>
                        
                        <div className='project-img-gallery'>
                            <ImageGallery 
                                items={ProjectData.at(selectedProject)?.images}
                                projectTitle={ProjectData.at(selectedProject)?.title}
                                aspectMult={ProjectData.at(selectedProject)?.galleryAspectMult}
                                projectId={selectedProject}
                            />
                        </div>
                </div>
            } />
        </Routes>
        </div>
      </div>        
    </div>

  );
};

export default Navigation;