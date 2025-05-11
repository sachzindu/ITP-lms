import { useState, useEffect } from 'react';
import { Film, Search, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLazyGetLecsQuery } from '../../redux/api/lecsApiSlice';
import { useDispatch } from 'react-redux';
import { setLecId } from '../../redux/features/services/lecSlice';
import { setCredentials } from '../../redux/features/services/lecSlice';


export default function VideoListView() {
  const navigate = useNavigate();
  const [getLecs]=useLazyGetLecsQuery();
 

  
  
  // Sample data - replace with your actual data
  const initialVideos = [
    
   
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [videos, setVideos] = useState(initialVideos);
  
  useEffect(()=>{

    const getLecsnow=async ()=>{
        try{

            const res=await getLecs().unwrap();
            setVideos(res.lec);

        }catch(error){
            console.log(error);

        }
    }

    getLecsnow();

    

  },[getLecs])
  
  const handleVideoClick = (path,path2) => {
    navigate('/student/videoplayer');
    useDispatch(setLecId(path));
    useDispatch(setCredentials(path2));
  };

  // Filter videos based on search term
  useEffect(() => {
    const results = videos.filter(video =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setVideos(results);
  }, [searchTerm]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Video Library</h1>
      
      {/* Search Bar */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search videos..."
          className="w-full pl-10 pr-4 py-3 border-0 rounded-lg bg-white shadow-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Videos List */}
      <div className="space-y-4">
        {videos.length > 0 ? (
          videos.map(video => (
            <div 
              key={video._id} 
              onClick={() => handleVideoClick(video.lecVideo.secure_url,video.lecDocument.secure_url)}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex cursor-pointer group relative transform hover:-translate-y-1"
            >
              <div className="bg-indigo-600 p-4 flex items-center justify-center group-hover:bg-indigo-700 transition-colors">
                <Film className="h-10 w-10 text-white" />
              </div>
              <div className="p-4 flex-1">
                <h2 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors">{video.title}</h2>
                <p className="text-gray-600 text-sm">{video.description}</p>
              </div>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="h-6 w-6 text-indigo-500" />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No videos found matching your search</p>
          </div>
        )}
      </div>
      
      {/* Video Count */}
      <div className="mt-8 text-right text-sm text-gray-500">
        Showing {videos.length} of {initialVideos.length} videos
      </div>
    </div>
  );
}