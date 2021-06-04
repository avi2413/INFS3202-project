import React, { useState } from 'react';
import { IconButton, Typography, Button, TextField, MenuItem, Grid } from '@material-ui/core';
import BackupIcon from '@material-ui/icons/Backup';
import Dropzone from 'react-dropzone';
import { purple } from '@material-ui/core/colors';
import Input from './Input';
import axios from 'axios';

const visibilities = [
    { value:0, label:'Private'},
    { value:1, label:'Public'}
]

const API = process.env.NODE_ENV === 'production' ? axios.create({baseURL: 'https://calm-fortress-17635.herokuapp.com'}) : 
        axios.create({baseURL: 'http://localhost:5000'});

const base_URL = process.env.NODE_ENV === 'production' ? 'https://calm-fortress-17635.herokuapp.com' : 'http://localhost:5000';

function UploadPage(props) {

    //const history = useHistory();
    const user = JSON.parse(localStorage.getItem('profile'));

    const [Title, setTitle] = useState('');
    const [Description, setDescription] = useState("");
    const [FilePath, setFilePath] = useState("");
    const [visibility, setVisibility] = useState(0);
    const [Duration, setDuration] = useState("");
    const [Thumbnail, setThumbnail] = useState("");


    const handleSubmit = (event) => {
        event.preventDefault();
        const variables = {
            writer: user.result._id,
            title: Title,
            description: Description,
            privacy: visibility,
            filePath: FilePath,
            //category: ,
            duration: Duration,
            thumbnail: Thumbnail
        }

        if (Title === "" || FilePath==="") {
            return alert("Please fill all the required field\nand/or upload valid video")
        }

        API.post('/video/uploadVideo', variables)
        .then(response => {
            if(response.data.success) {
                alert('Video published successfully (^.^)/[YAYYYYY!!!!!!]')
                props.history.push('/homepage')
            } else {
                alert('Failed to upload video. Server error!')
            }
        })
    };

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleDescChange = (event) => {
        setDescription(event.currentTarget.value);
    };
    
    
    const handleSelChange = (event) => {
        setVisibility(event.target.value);
    };

    const handleDrop = (files) => {
        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        
        formData.append("file", files[0]);

        API.post('/video/uploadfiles', formData, config)
        .then(response => {
            //console.log(response.data);
            if(response.data.success){
                let variable = {
                    filePath: response.data.filePath,
                    fileName: response.data.fileName
                }
                setFilePath(response.data.filePath)
                
                API.post('/video/thumbnails', variable)
                .then(response => {
                    if(response.data.success) {
                        setThumbnail(response.data.thumbsFilePath)
                        setDuration(response.data.fileDuration)
                    } else {
                        alert('Thumbnail fetch failed. error 500!')
                    }
                })
            } else {
                alert('Uploading failed. Server error!')
            }
        })
    }

    return ( 
        <div style={{maxWidth: '700px', margin: '2rem auto'}}>
            <div style={{textAlign: 'center', marginBottom: '2rem'}}>
                <Typography variant='h4' component='h2'>Upload Video</Typography>
            </div>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                    <Dropzone 
                        onDrop={handleDrop}
                        multiple={false}
                        maxSize={800000000}
                    >
                        {({getRootProps, getInputProps}) => (
                            <section>
                                <div style={{width: '300px', height:'240px', border: '5px solid grey'}} {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    
                                    <div style={{textAlign: 'center', position: 'relative', padding:'40px'}}>
                                        <IconButton color='primary' >
                                            <BackupIcon style={{ fontSize: 150, color: purple }} />
                                        </IconButton>
                                    </div>
                                </div>
                            </section>
                        )}
                    </Dropzone>
                    {Thumbnail !== "" && 
                        <div>
                            <img src={`${base_URL}/${Thumbnail}`} alt="img" />
                        </div>
                    }
                </div>
                <div style={{marginTop: '35px'}}>
                    <Input name="title" label="Title" handleChange={handleTitleChange} />
                </div>
                <div style={{marginTop: '25px'}}>
                    <Input name="description" label="Description" handleChange={handleDescChange} />
                </div>
                <div style={{marginTop: '25px'}}>
                    <Grid item xs={12} sm={12}>
                        <TextField 
                            id="selection-menu"
                            select
                            label="Visibility"
                            value={visibility}
                            onChange={handleSelChange}
                            variant="outlined"
                        >
                            {visibilities.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </div>
                <div style={{marginTop: '25px'}}>
                    <Button type="submit" variant="contained" color="primary">
                        Publish
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default UploadPage
