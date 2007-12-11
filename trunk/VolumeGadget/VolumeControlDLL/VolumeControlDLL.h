

/* this ALWAYS GENERATED file contains the definitions for the interfaces */


 /* File created by MIDL compiler version 6.00.0366 */
/* at Mon Nov 19 01:26:25 2007
 */
/* Compiler settings for .\VolumeControlDLL.idl:
    Oicf, W1, Zp8, env=Win32 (32b run)
    protocol : dce , ms_ext, c_ext, robust
    error checks: allocation ref bounds_check enum stub_data 
    VC __declspec() decoration level: 
         __declspec(uuid()), __declspec(selectany), __declspec(novtable)
         DECLSPEC_UUID(), MIDL_INTERFACE()
*/
//@@MIDL_FILE_HEADING(  )

#pragma warning( disable: 4049 )  /* more than 64k source lines */


/* verify that the <rpcndr.h> version is high enough to compile this file*/
#ifndef __REQUIRED_RPCNDR_H_VERSION__
#define __REQUIRED_RPCNDR_H_VERSION__ 475
#endif

#include "rpc.h"
#include "rpcndr.h"

#ifndef __RPCNDR_H_VERSION__
#error this stub requires an updated version of <rpcndr.h>
#endif // __RPCNDR_H_VERSION__

#ifndef COM_NO_WINDOWS_H
#include "windows.h"
#include "ole2.h"
#endif /*COM_NO_WINDOWS_H*/

#ifndef __VolumeControlDLL_h__
#define __VolumeControlDLL_h__

#if defined(_MSC_VER) && (_MSC_VER >= 1020)
#pragma once
#endif

/* Forward Declarations */ 

#ifndef __IVolumeControl_FWD_DEFINED__
#define __IVolumeControl_FWD_DEFINED__
typedef interface IVolumeControl IVolumeControl;
#endif 	/* __IVolumeControl_FWD_DEFINED__ */


#ifndef __VolumeControl_FWD_DEFINED__
#define __VolumeControl_FWD_DEFINED__

#ifdef __cplusplus
typedef class VolumeControl VolumeControl;
#else
typedef struct VolumeControl VolumeControl;
#endif /* __cplusplus */

#endif 	/* __VolumeControl_FWD_DEFINED__ */


/* header files for imported files */
#include "oaidl.h"
#include "ocidl.h"

#ifdef __cplusplus
extern "C"{
#endif 

void * __RPC_USER MIDL_user_allocate(size_t);
void __RPC_USER MIDL_user_free( void * ); 

#ifndef __IVolumeControl_INTERFACE_DEFINED__
#define __IVolumeControl_INTERFACE_DEFINED__

/* interface IVolumeControl */
/* [unique][helpstring][nonextensible][dual][uuid][object] */ 


EXTERN_C const IID IID_IVolumeControl;

#if defined(__cplusplus) && !defined(CINTERFACE)
    
    MIDL_INTERFACE("C28FF508-8AC3-4580-BD8A-9A3C3344CF1A")
    IVolumeControl : public IDispatch
    {
    public:
        virtual /* [helpstring][id] */ HRESULT STDMETHODCALLTYPE getVolume( 
            /* [retval][out] */ DWORD *volume) = 0;
        
        virtual /* [helpstring][id] */ HRESULT STDMETHODCALLTYPE setVolume( 
            /* [in] */ SHORT *volume) = 0;
        
        virtual /* [helpstring][id] */ HRESULT STDMETHODCALLTYPE toggleMute( void) = 0;
        
        virtual /* [helpstring][id] */ HRESULT STDMETHODCALLTYPE isMute( 
            /* [retval][out] */ SHORT *ismute) = 0;
        
        virtual /* [helpstring][id] */ HRESULT STDMETHODCALLTYPE isWinVista( 
            /* [retval][out] */ BYTE *vista) = 0;
        
    };
    
#else 	/* C style interface */

    typedef struct IVolumeControlVtbl
    {
        BEGIN_INTERFACE
        
        HRESULT ( STDMETHODCALLTYPE *QueryInterface )( 
            IVolumeControl * This,
            /* [in] */ REFIID riid,
            /* [iid_is][out] */ void **ppvObject);
        
        ULONG ( STDMETHODCALLTYPE *AddRef )( 
            IVolumeControl * This);
        
        ULONG ( STDMETHODCALLTYPE *Release )( 
            IVolumeControl * This);
        
        HRESULT ( STDMETHODCALLTYPE *GetTypeInfoCount )( 
            IVolumeControl * This,
            /* [out] */ UINT *pctinfo);
        
        HRESULT ( STDMETHODCALLTYPE *GetTypeInfo )( 
            IVolumeControl * This,
            /* [in] */ UINT iTInfo,
            /* [in] */ LCID lcid,
            /* [out] */ ITypeInfo **ppTInfo);
        
        HRESULT ( STDMETHODCALLTYPE *GetIDsOfNames )( 
            IVolumeControl * This,
            /* [in] */ REFIID riid,
            /* [size_is][in] */ LPOLESTR *rgszNames,
            /* [in] */ UINT cNames,
            /* [in] */ LCID lcid,
            /* [size_is][out] */ DISPID *rgDispId);
        
        /* [local] */ HRESULT ( STDMETHODCALLTYPE *Invoke )( 
            IVolumeControl * This,
            /* [in] */ DISPID dispIdMember,
            /* [in] */ REFIID riid,
            /* [in] */ LCID lcid,
            /* [in] */ WORD wFlags,
            /* [out][in] */ DISPPARAMS *pDispParams,
            /* [out] */ VARIANT *pVarResult,
            /* [out] */ EXCEPINFO *pExcepInfo,
            /* [out] */ UINT *puArgErr);
        
        /* [helpstring][id] */ HRESULT ( STDMETHODCALLTYPE *getVolume )( 
            IVolumeControl * This,
            /* [retval][out] */ DWORD *volume);
        
        /* [helpstring][id] */ HRESULT ( STDMETHODCALLTYPE *setVolume )( 
            IVolumeControl * This,
            /* [in] */ SHORT *volume);
        
        /* [helpstring][id] */ HRESULT ( STDMETHODCALLTYPE *toggleMute )( 
            IVolumeControl * This);
        
        /* [helpstring][id] */ HRESULT ( STDMETHODCALLTYPE *isMute )( 
            IVolumeControl * This,
            /* [retval][out] */ SHORT *ismute);
        
        /* [helpstring][id] */ HRESULT ( STDMETHODCALLTYPE *isWinVista )( 
            IVolumeControl * This,
            /* [retval][out] */ BYTE *vista);
        
        END_INTERFACE
    } IVolumeControlVtbl;

    interface IVolumeControl
    {
        CONST_VTBL struct IVolumeControlVtbl *lpVtbl;
    };

    

#ifdef COBJMACROS


#define IVolumeControl_QueryInterface(This,riid,ppvObject)	\
    (This)->lpVtbl -> QueryInterface(This,riid,ppvObject)

#define IVolumeControl_AddRef(This)	\
    (This)->lpVtbl -> AddRef(This)

#define IVolumeControl_Release(This)	\
    (This)->lpVtbl -> Release(This)


#define IVolumeControl_GetTypeInfoCount(This,pctinfo)	\
    (This)->lpVtbl -> GetTypeInfoCount(This,pctinfo)

#define IVolumeControl_GetTypeInfo(This,iTInfo,lcid,ppTInfo)	\
    (This)->lpVtbl -> GetTypeInfo(This,iTInfo,lcid,ppTInfo)

#define IVolumeControl_GetIDsOfNames(This,riid,rgszNames,cNames,lcid,rgDispId)	\
    (This)->lpVtbl -> GetIDsOfNames(This,riid,rgszNames,cNames,lcid,rgDispId)

#define IVolumeControl_Invoke(This,dispIdMember,riid,lcid,wFlags,pDispParams,pVarResult,pExcepInfo,puArgErr)	\
    (This)->lpVtbl -> Invoke(This,dispIdMember,riid,lcid,wFlags,pDispParams,pVarResult,pExcepInfo,puArgErr)


#define IVolumeControl_getVolume(This,volume)	\
    (This)->lpVtbl -> getVolume(This,volume)

#define IVolumeControl_setVolume(This,volume)	\
    (This)->lpVtbl -> setVolume(This,volume)

#define IVolumeControl_toggleMute(This)	\
    (This)->lpVtbl -> toggleMute(This)

#define IVolumeControl_isMute(This,ismute)	\
    (This)->lpVtbl -> isMute(This,ismute)

#define IVolumeControl_isWinVista(This,vista)	\
    (This)->lpVtbl -> isWinVista(This,vista)

#endif /* COBJMACROS */


#endif 	/* C style interface */



/* [helpstring][id] */ HRESULT STDMETHODCALLTYPE IVolumeControl_getVolume_Proxy( 
    IVolumeControl * This,
    /* [retval][out] */ DWORD *volume);


void __RPC_STUB IVolumeControl_getVolume_Stub(
    IRpcStubBuffer *This,
    IRpcChannelBuffer *_pRpcChannelBuffer,
    PRPC_MESSAGE _pRpcMessage,
    DWORD *_pdwStubPhase);


/* [helpstring][id] */ HRESULT STDMETHODCALLTYPE IVolumeControl_setVolume_Proxy( 
    IVolumeControl * This,
    /* [in] */ SHORT *volume);


void __RPC_STUB IVolumeControl_setVolume_Stub(
    IRpcStubBuffer *This,
    IRpcChannelBuffer *_pRpcChannelBuffer,
    PRPC_MESSAGE _pRpcMessage,
    DWORD *_pdwStubPhase);


/* [helpstring][id] */ HRESULT STDMETHODCALLTYPE IVolumeControl_toggleMute_Proxy( 
    IVolumeControl * This);


void __RPC_STUB IVolumeControl_toggleMute_Stub(
    IRpcStubBuffer *This,
    IRpcChannelBuffer *_pRpcChannelBuffer,
    PRPC_MESSAGE _pRpcMessage,
    DWORD *_pdwStubPhase);


/* [helpstring][id] */ HRESULT STDMETHODCALLTYPE IVolumeControl_isMute_Proxy( 
    IVolumeControl * This,
    /* [retval][out] */ SHORT *ismute);


void __RPC_STUB IVolumeControl_isMute_Stub(
    IRpcStubBuffer *This,
    IRpcChannelBuffer *_pRpcChannelBuffer,
    PRPC_MESSAGE _pRpcMessage,
    DWORD *_pdwStubPhase);


/* [helpstring][id] */ HRESULT STDMETHODCALLTYPE IVolumeControl_isWinVista_Proxy( 
    IVolumeControl * This,
    /* [retval][out] */ BYTE *vista);


void __RPC_STUB IVolumeControl_isWinVista_Stub(
    IRpcStubBuffer *This,
    IRpcChannelBuffer *_pRpcChannelBuffer,
    PRPC_MESSAGE _pRpcMessage,
    DWORD *_pdwStubPhase);



#endif 	/* __IVolumeControl_INTERFACE_DEFINED__ */



#ifndef __VolumeControlDLLLib_LIBRARY_DEFINED__
#define __VolumeControlDLLLib_LIBRARY_DEFINED__

/* library VolumeControlDLLLib */
/* [helpstring][version][uuid] */ 


EXTERN_C const IID LIBID_VolumeControlDLLLib;

EXTERN_C const CLSID CLSID_VolumeControl;

#ifdef __cplusplus

class DECLSPEC_UUID("5A409F51-AFFA-4096-95CB-FC4839C96B88")
VolumeControl;
#endif
#endif /* __VolumeControlDLLLib_LIBRARY_DEFINED__ */

/* Additional Prototypes for ALL interfaces */

/* end of Additional Prototypes */

#ifdef __cplusplus
}
#endif

#endif


