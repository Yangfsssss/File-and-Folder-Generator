import upperCaseTheFirstLetterOfAFileName from '../../utils.js';

export default function template_detail(fileName: string, detailFileName: string) {
	const upperCasedFileName = upperCaseTheFirstLetterOfAFileName(fileName);
	const upperCasedDetailFileName = upperCaseTheFirstLetterOfAFileName(detailFileName);

	return `
  import React, { useEffect, useState, useCallback, useMemo } from 'react';
  import { RouteComponentProps } from 'react-router-dom';
  import { Button, Card, Input, message, Modal } from 'antd';
  import BackBtn from 'components/BackBtn';
  import utils, { responseHandler } from 'utils';
  import { QueryGroupOrderDetailIF } from 'modules/specialMedicine/common/interface';
  import FileCard from 'components/fileCard/fileCard';
  import ModalForm from 'components/modalForm';
  import PatientInfoCard from 'components/patientInfoCard/patientInfoCard';
  import Gap from 'components/Gap';
  import {
    auditGroupStuff,
    AuditGroupStuffProps,
    queryGroupOrderDetail,
  } from '../../../../common/request';

  const ${upperCasedFileName + upperCasedDetailFileName} = (props: RouteComponentProps) => {
    const {
      location: { search },
    } = props;

    const queryMap = new URLSearchParams(search);
    const groupId = queryMap.get('groupId') || '';
    const patientId = queryMap.get('patientId') || '';

    const [rejectModalVisible, setRejectModalVisible] = useState(false);

    const [groupUserOrderDetail, setGroupUserOrderDetail] = useState<QueryGroupOrderDetailIF>();

    /** 请求数据并整理 */
    const init = useCallback(async () => {
      try {
        const groupUserOrderDetailRes = await queryGroupOrderDetail({
          queryFile: true,
          id: groupId,
        });

        setGroupUserOrderDetail({
          ...groupUserOrderDetailRes,
          applyTime: utils.fmtDate(groupUserOrderDetailRes.applyTime),
        });
      } catch (err) {
        message.error(err.message);
      }
    }, [groupId]);

    useEffect(() => {
      init();
    }, [init]);

    console.log('groupUserOrderDetail', groupUserOrderDetail);

    const extraPatientInfo = useMemo(() => (
      {
        items: [
          { title: '入组状态', dataIndex: 'statusValue' },
        ],
        data: {
          ...groupUserOrderDetail,
          apoplexy: groupUserOrderDetail?.extendInfo?.apoplexy,
        },
      }
    ), [groupUserOrderDetail]);

    // 病历诊断页
    const medicalRecord = groupUserOrderDetail?.files?.medicalRecord || [];
    // 处方
    const prescription = groupUserOrderDetail?.files?.prescription || [];

    const getCheckButtonAvailable = () => {
      return groupUserOrderDetail?.status === 'unApprove';
    };

    const check = () => {
      const prescriptionLength = prescription.length || 0;

      if (prescriptionLength === 0) {
        message.error('处方缺失，请补全资料后再进行操作');
        return false;
      }

      return true;
    };

    return (
      <div>
        <Card
          title="用药人基本信息"
          extra={(
            <>
              <Button
                disabled={!getCheckButtonAvailable()}
                onClick={() => setRejectModalVisible(true)}
              >
                审核失败
              </Button>
              <Button
                disabled={!getCheckButtonAvailable()}
                type="primary"
                onClick={() => {
                  if (check()) {
                    Modal.confirm({
                      title: '确认审核通过此入组申请吗？',
                      onOk() {
                        const data: AuditGroupStuffProps = {
                          groupId: Number(groupId),
                          operate: 'approve',
                        };

                        auditGroupStuff(data).then(
                          ...responseHandler('操作成功！', [() => init()]),
                        );
                      },
                      onCancel() {},
                    });
                  }
                }}
              >
                审核通过
              </Button>
              <BackBtn />
            </>
          )}
        >

          <PatientInfoCard
            patientId={patientId}
            extraItems={extraPatientInfo?.items}
            extraItemsData={extraPatientInfo?.data}
          />
        </Card>

        <FileCard
          title=" 病历诊断页(非必填)"
          bizType="medicalRecord"
          businessType="EN_GROUP"
          productCode="VEGARD"
          groupNo={groupUserOrderDetail?.groupNo}
          fileList={medicalRecord}
          extraButtons="default"
          refresh={init}
        />

        <InvoiceCard
        bizType="INVOICE"
        productCode="VEGARD"
        title={'发票'}
        extraButtons
        orderNo={claimOrderDetail?.orderNo}
        refresh={init}
        fileList={invoiceList}
        extraDisplayedItems={[
          {
            title: '是否系统中已有',
            dataIndex: 'repeat',
            render: (repeat: boolean) => (repeat ? '是' : '否'),
          },
        ]}
      />

        <ModalForm
          width={400}
          title="请填写驳回原因"
          visible={rejectModalVisible}
          setVisible={setRejectModalVisible}
          maskClosable={false}
          formItems={useMemo(() => [
            {
              name: 'remark',
              span: 24,
              children: <Input.TextArea rows={8} style={{ width: '100%' }} />,
              rules: [{ required: true, message: '请填写驳回原因' }, { type: 'string', max: 100, message: '驳回原因不能多于100字' }],
            },
          ], [])}
          extraFormData={{
            groupId: Number(groupId),
            operate: 'refuse',
          }}
          request={auditGroupStuff}
          cbs={[init]}
        />
      </div>
    );
  };

  export default ${upperCasedFileName + upperCasedDetailFileName};

  `;
}
