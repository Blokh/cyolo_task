import { applyDecorators } from '@nestjs/common';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';

export function UploadFileDecorator() {
    return applyDecorators(
        ApiConsumes('multipart/form-data'),
        ApiBody({
            description: 'File upload',
            schema: {
                type: 'object',
                properties: {
                    file: {
                        type: 'string',
                        format: 'binary',
                    },
                    retentionTimeInSeconds: {
                        type: 'number',
                        default: 60,
                        description: 'Retention time must be at least 60 seconds',
                    },
                },
                required: ['file'],
            },
        }),
    );
}
