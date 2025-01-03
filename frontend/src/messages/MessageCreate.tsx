import {
    CreateBase,
    Form,
    Identifier,
    RaRecord,
    SaveButton,
    useGetIdentity,
    useListContext,
    useNotify,
    useRecordContext,
    useResourceContext,
    useUpdate,
} from 'react-admin';
import { useFormContext } from 'react-hook-form';
import { FFmpeg } from '@ffmpeg/ffmpeg';

import { Button, Stack } from '@mui/material';
import { MessageInputs } from './MessageInputs';
import { getCurrentDate } from './utils';
import {useRef, useState} from 'react';

export const MessageCreate = ({ showStatus }: { showStatus?: boolean }) => {
    const record = useRecordContext(); // The receiver's record
    const { identity } = useGetIdentity(); // The logged-in user's identity

    if (!record || !identity) return null;

    return (
        <CreateBase resource="messages" redirect={false}>
            <Form>
                <MessageInputs showStatus={showStatus} />
                <Stack direction="row">
                    <MessageCreateButton record={record} />
                    <RecordVideoButton />
                </Stack>
            </Form>
        </CreateBase>
    );
};

const MessageCreateButton = ({ record }: { record: RaRecord<Identifier> }) => {
    const notify = useNotify();
    const { identity } = useGetIdentity();
    const { reset } = useFormContext();
    const { refetch } = useListContext();

    if (!record || !identity) return null;

    const resetValues = {
    text: '',
    attachments: [],
    created_at: null,
};

    const handleSuccess = () => {
        reset(resetValues, { keepValues: false });
        if (refetch) {
            refetch();
        }
        notify('Message Sent');
    };

    return (
        <SaveButton
            type="button"
            label="Send Message"
            variant="contained"
            resource="messages"
            transform={data => {
                return {
                    ...data,
                    patient_id: 'dentist' in record ? record.id : identity.id,
                    dentist_id: 'dentist' in record ? identity.id : record.id,
                    sender_id: identity.id,
                    created_at: data.created_at || getCurrentDate(),
                };
            }}
            mutationOptions={{
                onSuccess: handleSuccess,
            }}
        />
    );
};

const RecordVideoButton = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isTranscoding, setIsTranscoding] = useState(false);
    const { setValue, getValues } = useFormContext();

    const ffmpeg = new FFmpeg();

    const handleStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }

            const recorder = new MediaRecorder(stream);
            setMediaRecorder(recorder);
            const chunks: BlobPart[] = [];
            setIsRecording(true);

            recorder.ondataavailable = event => {
                if (event.data.size > 0) {
                    chunks.push(event.data);
                }
            };

            recorder.onstop = async () => {
                const webmBlob = new Blob(chunks, { type: 'video/webm' });
                setIsRecording(false);

                // Stop video stream
                stream.getTracks().forEach(track => track.stop());

                // Transcode to MP4
                setIsTranscoding(true);
                if (!ffmpeg.loaded) {
                    await ffmpeg.load();
                }

                const webmArrayBuffer = await webmBlob.arrayBuffer();

                // Write webm to FFmpeg's virtual file system
                await ffmpeg.writeFile('input.webm', new Uint8Array(webmArrayBuffer));

                // Run FFmpeg command to transcode webm to mp4
                await ffmpeg.exec(['-i', 'input.webm', 'output.mp4']);

                // Read the output mp4 file
                const mp4Data = await ffmpeg.readFile('output.mp4');
                const mp4Blob = new Blob([mp4Data], { type: 'video/mp4' });

                // Attach the mp4 video to form attachments
                const currentAttachments = getValues('attachments') || [];
                setValue('attachments', [
                    ...currentAttachments,
                    new File([mp4Blob], 'recorded-video.mp4', { type: 'video/mp4' }),
                ]);

                if (videoRef.current) {
                    videoRef.current.srcObject = null;
                }

                setIsTranscoding(false);
            };

            recorder.start();
        } catch (error) {
            console.error('Error accessing camera:', error);
            setIsRecording(false);
            setIsTranscoding(false);
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
        }
    };

    return (
        <Stack direction="column" spacing={2}>
            <video ref={videoRef} style={{ width: '300px', marginBottom: '10px' }} controls />
            <Stack direction="row" spacing={2}>
                <Button
                    variant="outlined"
                    onClick={handleStartRecording}
                    disabled={isRecording || isTranscoding}
                >
                    {isRecording ? 'Recording...' : isTranscoding ? 'Transcoding...' : 'Start Recording'}
                </Button>
                {isRecording && (
                    <Button variant="contained" color="secondary" onClick={handleStopRecording}>
                        Stop Recording
                    </Button>
                )}
            </Stack>
        </Stack>
    );
};
