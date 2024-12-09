import { useState } from "react";
import styled from "styled-components";
import { TextField, Button, CircularProgress } from "@mui/material";
import axiosInstance from "../../api/axios";
import { useSelector } from "react-redux";

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: ${({ theme }) => theme.background};
  border-radius: 8px;
  width: 400px;
  margin: auto;
`;

const FormTitle = styled.h2`
  font-size: 1.7rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.text};
  text-align: center;
`;

const StyledTextField = styled(TextField)`
  background-color: ${({ theme }) => theme.bgLighter};
  && {
    margin-bottom: 20px;
    .MuiInputBase-root {
      color: ${({ theme }) => theme.text};
    }
    .MuiInputLabel-root {
      color: ${({ theme }) => theme.text};
    }
  }
`;

const VideoInput = styled.input`
  margin-bottom: 20px;
  color: ${({ theme }) => theme.text};
`;

const SubmitButton = styled(Button)`
  && {
    background-color: ${({ theme }) => theme.primary};
    color: white;
    &:hover {
      background-color: ${({ theme }) => theme.secondary};
    }
  }
`;

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

  if (!user) return <div>Loading user data...</div>;

  if (!user) {
    return (
      <div>
        <p>You need to be logged in to upload a video. Please log in.</p>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleVideoChange = (e) => {
    setFormValues({ ...formValues, video: e.target.files[0] });
  };

  const handleThumbnailChange = (e) => {
    setFormValues({ ...formValues, thumbnail: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", formValues.title);
    formData.append("des", formValues.description);
    formData.append("tags", formValues.tags);
    formData.append("videoUrl", formValues.video);
    formData.append("imgUrl", formValues.thumbnail);

    try {
      const response = await axiosInstance.post("/video/add-video", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Video uploaded successfully:", response.data);
    } catch (error) {
      console.error("Error uploading video:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper>
      <FormTitle>Upload Video</FormTitle>
      <form onSubmit={handleSubmit}>
        <StyledTextField
          label="Title"
          variant="outlined"
          name="title"
          value={formValues.title}
          onChange={handleInputChange}
          fullWidth
        />
        <StyledTextField
          label="Description"
          variant="outlined"
          name="description"
          value={formValues.description}
          onChange={handleInputChange}
          fullWidth
          multiline
          rows={4}
        />
        <StyledTextField
          placeholder="Tags (comma-separated)"
          label="Tags"
          variant="outlined"
          name="tags"
          value={formValues.tags}
          onChange={handleInputChange}
          fullWidth
        />
        <div className="flex flex-col">
        <label className="text-white pt-4">Video</label>
        <VideoInput type="file" accept="video/*" onChange={handleVideoChange} />
        </div>
        <label className="text-white pt-4">Thumbnail</label>
        <VideoInput type="file" accept="image/*" onChange={handleThumbnailChange} />
        <SubmitButton
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
        </SubmitButton>
      </form>
    </FormWrapper>
  );
};

export default UploadVideo;
