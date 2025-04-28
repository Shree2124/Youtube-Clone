import { useState, useCallback } from "react";
import { TextField, Button, CircularProgress, LinearProgress, Typography, Box } from "@mui/material";
import { useSelector } from "react-redux";
import axiosInstance from "../../api/axios";

const UploadVideo = () => {
  const { user } = useSelector((state) => state?.user);
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    tags: "",
    video: null,
    thumbnail: null,
  });
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");

  if (!user) {
    return (
      <Box sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2 }}>
        <Typography variant="body1" sx={{ color: 'text.primary' }}>
          You need to be logged in to upload a video. Please log in.
        </Typography>
      </Box>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleFileChange = (e, fieldName) => {
    setFormValues({ ...formValues, [fieldName]: e.target.files[0] });
  };

  // Chunk-based file upload function
  const uploadFileInChunks = useCallback(async (file, fieldName) => {
    const chunkSize = 1024 * 1024 * 2; // 2MB chunks
    const totalChunks = Math.ceil(file.size / chunkSize);
    const formData = new FormData();
    
    // Add metadata to the first chunk
    formData.append("title", formValues.title);
    formData.append("des", formValues.description);
    formData.append("tags", formValues.tags);
    formData.append("fileName", file.name);
    formData.append("fileType", file.type);
    formData.append("fieldName", fieldName);
    formData.append("totalChunks", totalChunks);
    
    let uploadedChunks = 0;
    let fileId = null;

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * chunkSize;
      const end = Math.min(file.size, start + chunkSize);
      const chunk = file.slice(start, end);
      
      const chunkFormData = new FormData();
      chunkFormData.append("chunk", chunk);
      chunkFormData.append("chunkIndex", chunkIndex);
      
      if (fileId) {
        chunkFormData.append("fileId", fileId);
      }
      
      if (chunkIndex === 0) {
        // First chunk contains metadata
        for (let [key, value] of formData.entries()) {
          chunkFormData.append(key, value);
        }
      }
      
      try {
        const response = await axiosInstance.post(
          "/video/upload-chunk", 
          chunkFormData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        
        if (chunkIndex === 0) {
          // Save fileId from first chunk response
          fileId = response.data.fileId;
        }
        
        uploadedChunks++;
        const progress = Math.round((uploadedChunks / totalChunks) * 100);
        setUploadProgress(progress);
        setUploadStatus(`Uploading ${fieldName === 'video' ? 'video' : 'thumbnail'}: ${progress}%`);
        
      } catch (error) {
        console.error(`Error uploading chunk ${chunkIndex}:`, error);
        throw error;
      }
    }
    
    return fileId;
  }, [formValues]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress(0);
    setUploadStatus("Preparing upload...");

    try {
      // First validate the form data
      if (!formValues.title.trim()) {
        setUploadStatus("Error: Title is required");
        return;
      }
      if (!formValues.description.trim()) {
        setUploadStatus("Error: Description is required");
        return;
      }
      if (!formValues.video) {
        setUploadStatus("Error: Video file is required");
        return;
      }
      if (!formValues.thumbnail) {
        setUploadStatus("Error: Thumbnail image is required");
        return;
      }

      // Upload video file in chunks
      setUploadStatus("Uploading video file...");
      const videoFileId = await uploadFileInChunks(formValues.video, "video");
      
      // Upload thumbnail in chunks
      setUploadStatus("Uploading thumbnail...");
      const thumbnailFileId = await uploadFileInChunks(formValues.thumbnail, "thumbnail");
      
      // Complete the upload process by merging chunks
      setUploadStatus("Finalizing upload...");
      const finalResponse = await axiosInstance.post("/video/add-video", {
        videoFileId,
        thumbnailFileId,
        title: formValues.title,
        des: formValues.description,
        tags: formValues.tags
      });
      
      setUploadStatus("Upload completed successfully!");
      console.log("Video uploaded successfully:", finalResponse.data);
      
      // Reset form
      setFormValues({
        title: "",
        description: "",
        tags: "",
        video: null,
        thumbnail: null
      });
      
    } catch (error) {
      console.error("Error uploading video:", error);
      setUploadStatus(`Upload failed: ${error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        p: 4, 
        bgcolor: 'background.paper', 
        borderRadius: 2, 
        width: { xs: '90%', sm: '450px' }, 
        mx: 'auto',
        boxShadow: 3
      }}
    >
      <Typography 
        variant="h4" 
        component="h2" 
        sx={{ 
          mb: 3, 
          color: 'text.primary', 
          textAlign: 'center',
          fontWeight: 500
        }}
      >
        Upload Video
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          variant="outlined"
          name="title"
          value={formValues.title}
          onChange={handleInputChange}
          fullWidth
          sx={{ mb: 3, bgcolor: 'background.default' }}
          InputProps={{ sx: { color: 'text.primary' } }}
          InputLabelProps={{ sx: { color: 'text.secondary' } }}
          required
        />
        
        <TextField
          label="Description"
          variant="outlined"
          name="description"
          value={formValues.description}
          onChange={handleInputChange}
          fullWidth
          multiline
          rows={4}
          sx={{ mb: 3, bgcolor: 'background.default' }}
          InputProps={{ sx: { color: 'text.primary' } }}
          InputLabelProps={{ sx: { color: 'text.secondary' } }}
          required
        />
        
        <TextField
          label="Tags (comma-separated)"
          placeholder="funny, tutorial, gaming"
          variant="outlined"
          name="tags"
          value={formValues.tags}
          onChange={handleInputChange}
          fullWidth
          sx={{ mb: 3, bgcolor: 'background.default' }}
          InputProps={{ sx: { color: 'text.primary' } }}
          InputLabelProps={{ sx: { color: 'text.secondary' } }}
        />
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ color: 'text.primary', mb: 1 }}>
            Video File {formValues.video && `(${(formValues.video.size / (1024 * 1024)).toFixed(2)} MB)`}
          </Typography>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => handleFileChange(e, "video")}
            style={{ color: 'inherit', width: '100%' }}
            required
          />
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ color: 'text.primary', mb: 1 }}>
            Thumbnail Image {formValues.thumbnail && `(${(formValues.thumbnail.size / (1024 * 1024)).toFixed(2)} MB)`}
          </Typography>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "thumbnail")}
            style={{ color: 'inherit', width: '100%' }}
            required
          />
        </Box>
        
        {(uploadProgress > 0 || loading) && (
          <Box sx={{ mb: 2 }}>
            <LinearProgress variant="determinate" value={uploadProgress} sx={{ mb: 1 }} />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {uploadStatus}
            </Typography>
          </Box>
        )}
        
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'white',
            '&:hover': { bgcolor: 'primary.dark' },
            py: 1.5
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Upload Video"}
        </Button>
      </form>
    </Box>
  );
};

export default UploadVideo;