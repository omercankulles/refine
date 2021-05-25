import {
    Typography,
    Button,
    Show,
    Space,
    useList,
    MarkdownField,
    useOne,
    useUpdate,
} from "@pankod/refine";

import { IPost, ICategory } from "interfaces";

const { Title, Text } = Typography;

export const PostReview = () => {
    const { data, isLoading } = useList<IPost>("posts", {
        filters: [
            {
                field: "status",
                operator: "eq",
                value: "draft",
            },
        ],
        pagination: { pageSize: 1 },
    });

    const record = data?.data[0];

    const {
        data: categoryData,
        isLoading: categoryIsLoading,
    } = useOne<ICategory>("categories", record!?.category.id, {
        enabled: !!record,
    });

    const mutationResult = useUpdate<IPost>("posts");

    const { mutate, isLoading: mutateIsLoading } = mutationResult;

    const handleUpdate = (item: IPost, status: string) => {
        mutate({ id: item.id, values: { ...item, status } });
    };

    const buttonDisabled = isLoading || categoryIsLoading || mutateIsLoading;

    return (
        <Show
            title="Review Posts"
            resource="posts"
            recordItemId={record?.id}
            isLoading={isLoading || categoryIsLoading}
            pageHeaderProps={{
                backIcon: false,
            }}
            actionButtons={
                <Space
                    key="action-buttons"
                    style={{ float: "right", marginRight: 24 }}
                >
                    <Button
                        danger
                        disabled={buttonDisabled}
                        onClick={() =>
                            record && handleUpdate(record, "rejected")
                        }
                    >
                        Reject
                    </Button>
                    <Button
                        type="primary"
                        disabled={buttonDisabled}
                        onClick={() =>
                            record && handleUpdate(record, "published")
                        }
                    >
                        Approve
                    </Button>
                </Space>
            }
        >
            <Title level={5}>Status</Title>
            <Text>{record?.status}</Text>
            <Title level={5}>Title</Title>
            <Text>{record?.title}</Text>
            <Title level={5}>Category</Title>
            <Text>{categoryData?.data.title}</Text>
            <Title level={5}>Content</Title>
            <MarkdownField value={record?.content} />
        </Show>
    );
};